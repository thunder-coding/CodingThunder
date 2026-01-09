---
author: "Yaksh Bariya"
title: "Docker on tmpfs"
description: "Running entire docker container"
tags: ["docker", "tmpfs", "linux", "containerd", "containers", "ram"]
publishdate: "2026-01-10T02:15:00+05:30"
---

## The motivation

Being one of the maintainers of [Termux](https://termux.dev), I have to constantly build packages from source. Sometimes I have to rebuild the same package multiple times to fix some bug. Some of the packages are not so friendly on disk-writes. Some packages require cloning large git repos (multiple gigabytes), build itself does writes of multiple gigabytes at times. Some of the builds fail mid-way, thus having to repeat the entire cycle once again. Once again gigabytes of writes to the disk. During rebuilds of large packages with large reverse dependency trees, rebuilds are even longer. Once I even managed to do 1TBW on my SSD in a span of 10 hours. This was during test-rebuild of around 300 or the 3000 packages we have during [CMake 4.0 update](https://github.com/termux/termux-packages/pull/25014). Initially the plan was to rebuild all packages and obtain a list of all packages that are failing to build but it was later abandoned due to large amount of disk writes it'd do.

If I continued on that journey, I'd have exhausted a good chunk of my SSD's lifespan by now, and my SMART diagnostics would have been screaming at me.

Also the blinking hard disk LED on my laptop is quite annoying, so that's an additional motivational factor.

## Analyzing docker directories

Docker stores it's daemon configuration at `/etc/docker/daemon.json`. Looking over there:

```json
{
	"data-root": "/var/lib/docker",
}
```

This is where docker stores all **persistent** data including containers, images, volumes, and all [^1]

First we need to stop docker, or else weird things could happen:
```sh
sudo systemctl stop docker.service
sudo systemctl stop docker.socket
```

So let's try to mount `/var/lib/docker` on tmpfs. First we clean the entire `/var/lib/docker` as we need to mount a tmpfs. And mounting filesystems require the directory to be empty. You can also choose to copy your `/var/lib/docker` to restore it back after mounting the tmpfs if you wish to keep your old containers and images. For me I had nothing very important so I decided to just nuke it all for good.

```sh
sudo rm -r /var/lib/docker
sudo mkdir /var/lib/docker
```

Now, let's mount the tmpfs:
```sh
sudo mount -t tmpfs none -o size=48G /var/lib/docker
```

The default tmpfs size is of 16G, which may not be enough for your needs. It wasn't for me atleast, as the docker image we use for building packages is 8G+ uncompressed when built locally.

If you had earlier backed-up your `/var/lib/docker`, it's time to restore it now.

Now, the moment of truth. Let's get docker running and see if things are working as expected.

```sh
sudo systemctl start docker.service
```

Now start your favourite container and do some writes.

```
dd if=/dev/random of=myfile.txt count=4 size=1G
```

And your disk LED indicator doesn't blink (in your dreams). You ask yourself, why is it blinking? It's not supposed to.


## Partial failure

Your write-heavy docker container is still writing to disks and you can see that in your `htop`'s I/O tab or `iotop` (whihchever's your favourite. I prefer htop but you are allowed to have your own choices).

### So what went wrong?

Remember the docker documentation about docker storing persistent files in `/var/lib/docker`, then why is it doing writes outside of there?

Turns out it's containerd, the underlying layer which docker uses to manage namespaces, volumes for containers with the Linux kernel. Containerd mounts `overlayfs` for mounting partitions for the containers that are going to run. Since we know that it's using overlayfs, we can just give a peek at all the mounts we have using `mount`:

```
proc on /proc type proc (rw,nosuid,nodev,noexec,relatime)
sys on /sys type sysfs (rw,nosuid,nodev,noexec,relatime)
...
overlay on /var/lib/docker/rootfs/overlayfs/555bd63bcb12dc7a5676d1005fdc22140555e6786e05e637fbdbe9758236043d type overlay (rw,relatime,lowerdir=/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/10/fs:/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/9/fs:/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/8/fs:/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/7/fs:/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/6/fs:/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/5/fs:/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/4/fs:/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/3/fs:/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/2/fs:/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/1/fs,upperdir=/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/11/fs,workdir=/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/11/work,index=off)
```

If you don't know how overlayfs works, I'd highly recommend checking out the Linux kernel documentation about overlayfs first before reading beyond this section [^2]

A quick brief would be that overlayfs allows you to mount multiple directories together. Effectively merging them without actually merging them. You get a virtual filesystem which is a combination of all the lowerdir. All writes goes to upperdir. workdir is used internally by the kernel, documentation doesn't specify how though. Files are first looked for in upperdir and only looked for in lowerdir if they don't exist in upperdir. This is also what allows docker to split an image in layers. Each layer is effectively the upperdir of the step which was executed during image creation. At the end when running the container, additional overlayfs is mounted with the image as lowerdir and container's specific writes inside it's own upperdir. This is what allows docker to run large containers without having to copy each and every file. Pretty amazing, huh! Anyways this is not what we are after right now, so let's not get sidetracked.

So looking at the above overlayfs mount, we can see that containerd, is storing the actual container's files when it is executed in `/var/lib/containerd/*`, so this also needs to be on tmpfs like `/var/lib/docker`.

So it's simple, just mount `/var/lib/containerd` on tmpfs like we did for `/var/lib/docker` and restart the docker service. Instant profit! This time we also need to restart the containerd service as we are messing with it's files

```sh
sudo systemctl stop docker.service
sudo systemctl stop docker.socket
sudo systemctl stop containerd.service
sudo rm -r /var/lib/containerd
sudo rm -r /var/lib/docker
sudo mkdir /var/lib/containerd
sudo mkdir /var/lib/docker
sudo mount -t tmpfs -o size=48G /var/lib/containerd
sudo mount -t tmpfs -o size=48G /var/lib/docker
sudo systemctl start docker.service
```

When starting the docker service, it should start the containerd service as well. Stopping docker daemon doesn't seem to stop containerd, so we have to do it manually

And voila! It's running on tmpfs now. Although I would consider you to be a total crazy person like me to use RAM for such crazy experiments considering RAM prices nowadays.

## Additional notes and recommendation

I'd recommend setting up zram on your device depending on the amount of system memory you have available. Most of the stuff in `/var/lib/docker/rootfs` can be compressed pretty well, and you might benefit from compression when those files are not accessed. And anyways zram doesn't kick in unless you actually need it depending on your swappiness kernel config. It acts just like swap but on RAM. Setting up zram should also allow you to overprovision the size of your mounts for containers and docker data directory. Depending on memory pressure, zram gives easily around 2:1 compression ratio on average. With multiple VMs running during benchmarking of zram for my personal use, I have even managed to get 3.5:1 compression ratio. Your mileage will definitely vary based on your workflow.

For me honestly the performance benefits of not having to write to the disks, and additionally not absolutely burning my SSD's lifespan is definitely worth it. And with zram, I can manage to even keep my browser, and other applications open with full docker running on tmpfs and building most packages for Termux.


[^1]: Docker data directory https://docs.docker.com/engine/daemon/#daemon-data-directory
[^2]: OverlayFS kernel documentation https://docs.kernel.org/filesystems/overlayfs.html
