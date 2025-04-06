---
author: "Yaksh Bariya"
title: "Interesting case of /proc and /dev on POSIX systems"
description: "Read how I learnt that reading the POSIX specifications is a good thing than relying solely on online blogs and articles about POSIX stuff"
tags: ["posix", "unix", "linux", "macos", "freebsd", "posix standards", "procfs"]
publishdate: "2025-04-06T19:45:00+05:30"
---

## TL;DR

If you want to have a good read, I'd recommend skipping the TL;DR segment. You might miss some fun when reading the article if you read this out. You've been warned.

`/dev/stdin`, `/dev/stdout`, and `/stderr` are not required to be implemented by the POSIX standard, but are listed as POSIX extensions.
Similarly, `/proc` (or the procfs) is also just listed as an extension just once in the POSIX standard, with no mention of what things need to be there inside.

If you read it fully, you might find a interesting thing or two which you might get surprised to figure out even if you are using a Unix-like system since years.

> [!NOTE]
> From [Wikipedia's POSIX page section "Versions after 1997"](https://en.wikipedia.org/wiki/POSIX#Versions_after_1997)
> 
> After 1997, the Austin Group developed the POSIX revisions. The specifications are known under the name Single UNIX Specification, before they become a POSIX standard when formally approved by the ISO. 
>
> From [Wikipedia's UNIX page](https://en.wikipedia.org/wiki/Single_UNIX_Specification)
> The Single UNIX Specification (SUS) is a standard for computer operating systems, compliance with which is required to qualify for using the "UNIX" trademark.
>
> So every UNIX system can also be referred as a POSIX system.

## Introduction

If you have use Linux, or any other *NIX like system, or even just wrote bash scripts to automate your silly tasks in the terminal, you might be knowing of the following special files:
- `/dev/stdin`
- `/dev/stdout`
- `/dev/stderr`
- `/dev/null`
- `/dev/random`
- `/dev/sd{a,b,...}`
- `/proc/*`

If not all, you might be atleast knowing a few of them (if not others atleast `/dev/stdin`, `/dev/stdout` or `/dev/stderr`). Now I am not going to the depths of *NIX and try to explain in detail about each and every of these files, because I believe there are better articles on the web that do their job pretty well.

This article is going to be about portability and how a lot of the Unix-like systems which are popular today differ from the POSIX standards

## File Descriptors on POSIX systems

File Descriptors (or FDs in short) are just integer identifiers for open files for a process. There are 3 special FDs:
- `0`: for `stdin`
- `1`: for `stdout`
- `2`: for `stderr`

Now if you are a seasoned Bash scripting guy (or even a seasonal one), you might have done something like this to pass the output of previous command to an executable that does not support reading from the `stdin`, but only supports reading from a file:

```bash
# prev_command | ./another_executable
# Above commented command doesn't work as another_executable isn't designed to read from stdin
prev_command | ./another_executable /dev/stdin
```

This just tricks the `another_executable` to read from `stdout` even though the executable doesn't support it. This is because on a lot of UNIX-like Systems (but not all UNIX-like systems, and we'll be coming to that point later), `/dev/stdin` is a special block device that just contains the contents of the standard input.

Similarly, the following hack is also used at times when the command only supports writing to a file, but you want the output in `stdout`:
```bash
./command /dev/stdout
```

This works, just like the above command. [UNIX philosophy of everything is a file](https://en.wikipedia.org/wiki/Everything_is_a_file) is indeed really wonderful.

You might have used `/dev/stdin`, `/dev/stdout` and `/dev/stderr` on a multitude of systems including Linux, FreeBSD, etc.

## `/dev` and `/proc` virtual filesystem

If you are using a Unix-like system since some time, you must be knowing that [`/dev`](https://en.wikipedia.org/wiki/Device_file), [`/proc`](https://en.wikipedia.org/wiki/Procfs) and `/sys` are some special directories containing virtual devices/other virtual files that contain system information like uptime information, kernel version, cpu information, etc. You might even have read from them for your own bash scripts at times.


### Surprise 1: `/dev/stdin`, `/dev/stdout` and `/dev/stderr` may not exist on a POSIX compliant system

This started with me running the [Node.js](https://nodejs.org) test suite on my old Android device running Android 7.0. Some of the tests that failed on it were tests trying to read the `/dev/stdin` file instead of just simply trying to read the file via `process.stdin`. There are tests for `process.stdin` separately as well, but some were hardcoded to simply read `/dev/stdin` on Unix-like systems. One of the tests had something like ([`test/parallel/test-fs-readfile-pipe-large.js`](https://github.com/nodejs/node/blob/74722a55a6cea73b6dcaa3e4adc7ba8e9268b2db/test/parallel/test-fs-readfile-pipe-large.js#L12)):


```js
...
fs.readFile('/dev/stdin', function(er, data) {
  assert.ifError(er);
  process.stdout.write(data);
});
...
```

Then I was like, huh! Why is this failing with an error indicating that the file `/dev/stdin` does not exist? I just did a quick `file /dev/stdin` and found that it doesn't exist. Nor did `/dev/stdout` and `/dev/stderr` exist. I just used to assume that they do exist on all devices! Then I looked on the internet to find the workaround, and [StackOverflow gave me a workaround: to use `/proc/self/fd/{fd}` where fd is 0, 1 or 2](https://stackoverflow.com/a/24598112). And it worked.

Then I fixed the tests and kept the patches with me for around 3 years and forgot about it. And now that I decided to upstream some of the Android build fixes for Node.js which I was keeping so that others may benefit. I sent the PR and waited for CI to turn green, but it failed. And it turns out that MacOS doesn't have procfs (`/proc`), but exposes most of those stuff via sysctl as documented over https://web.archive.org/web/20200103161748/http://osxbook.com/book/bonus/ancient/procfs/. This time, I checked whether the patch was actually needed right now. Maybe Android now as `/dev/stdin`, `/dev/stdout` and `/dev/stderr`.


I tried running these tests patching `/dev/std*` to their `/proc/self/fd/*` replacements on my new Android 15 device. And it worked! You can find the PR where I am submitting the fixes for some of the build failures for Android to upstream over at https://github.com/nodejs/node/pull/57748

Then I looked over on my Arch Linux system:

```bash
$ file /dev/std*
/dev/stderr: symbolic link to /proc/self/fd/2
/dev/stdin:  symbolic link to /proc/self/fd/0
/dev/stdout: symbolic link to /proc/self/fd/1
```
Huh! and they exist on my Arch box. with symlinks to `/proc/self/fd/0`, `/proc/self/fd/1` and `/proc/self/fd/2`

Then I once again looked on my newer Android device:
```bash
# Can't use glob /dev/std* without root on Termux (works with ADB though)
~ $ file /dev/stdin
/dev/stdin: symbolic link to /proc/self/fd/0
~ $ file /dev/stdout
/dev/stdout: symbolic link to /proc/self/fd/1
~ $ file /dev/stderr
/dev/stderr: symbolic link to /proc/self/fd/2
```

Perhaps `/dev/std*` didn't exist on the older Android device as it had a really older kernel version. I didn't have the older device with me, so I tried running a Android VM with Android 8.1 and it didn't have `/dev/std*` as well, so definitely it was a Android using older version of the Linux kernel.

So, Linux just has `/dev/std*` as symlinks to `/proc/self/fd/*`. But those don't exist on MacOS. Why is MacOS acting weird and not just following the standard. And FreeBSD too didn't have `/proc` virtual filesystem. I couldn't find any information about why this is the case, so I decided to take matters into my own hands and try to read the POSIX manual and figure out if `/dev/stdin`, `/dev/stdout` `/dev/stderr`, and `/proc/*` are even part of the specification. And they aren't! Yes, you read that right, `/dev/stdin`, `/dev/stdout` and `/dev/stderr` are mentioned exactly once together and are mentioned as *optional* **non-standard** extensions.

Both `/dev/stdin` and `/dev/stderr` are just mentioned exactly once in the entire [POSIX.1-2024](https://doi.org/10.1109/IEEESTD.2024.10555529) document (the latest as of writing this blog) which defines the standards for any system to be POSIX complaint.

> 4.  The system may provide non-standard extensions. These are features not required by
POSIX.1-2024 and may include, but are not limited to:
>
> - ...
> - Additional character special files with special properties (for example, /dev/stdin, /dev/stdout, and /dev/stderr)
>
> > 2.1.1 Requirements, Page 15

But funnily enough there are a total of 14 mentions of `/dev/stdout` in the document as possible files passed to various POSIX command line utilities. Some of them mentions that passing `-` or `/dev/stdout` to the output file would result in the output being written to the `stdout`. So perhaps, even though the `/dev/stdout` is an *optional* **non-standard** extension, it's popular enough that the authors decided to mention it in the document.


### Surprise 2: `/proc` itself may not exist on a POSIX compliant system

The POSIX standards do not even specify anything about `/proc`, even the procfs is mentioned only once in the entire document as a non-standard extension. (See Page 15 of the document 2.1.1 Requirements).

FreeBSD doesn't even have procfs enabled by default and you need to [mount it yourself](https://www.cyberciti.biz/faq/howto-freebsd-mount-procfs/). And [it's deprecated](https://man.freebsd.org/cgi/man.cgi?query=procfs)

### Surprise 3: `/dev/random` is also not part of the POSIX specification

You might have just read from `/dev/random` multiple times in bash scripts when trying to gather some entropy or random data. But the POSIX has no mention it in it's entire specification! In fact the POSIX specification only mentions about `/dev/null`, `/dev/tty` and `/dev/console`. Yes, that's the entire thing documented under chapter 10 titled "Directory Structure and Devices".


## Conclusion

There `/dev/stdin`, `/dev/stdout` or `/dev/stderr` which is guaranteed to work on all POSIX systems. It is very important to note this when writing portable software. Although all these files exist on almost all POSIX system I have used (if you add the old Android phone I mentioned of earlier), it's not guaranteed to work. The only portable way is to actually just use the file descriptors `0`, `1`, and `2` for `/dev/stdin`, `/dev/stdout` and `/dev/stderr` respectively. And there exists no portable way to specify a program to write to stdout/stderr instead of a file unless the program supports doing it.

Although a lot of the special files which we are used to in the `/dev` and `/proc` are missing from the POSIX standard, I must say that almost all of the C APIs are really well thought and documented really well. The `struct`s for all the data types like `addrinfo` are really well thought of. The C API documentation also is very extensive. This  proves that even after 50+ years of existing, Unix's design was just really good and well thought that still today we have majority of webservers, and almost all of the supercomputers in the world running either Linux or other Unix-like OS like BSDs. I just find it wild how well thought the entire Unix OS was at that time!

Also at times, it's better to read the documentation/manual/specification instead of relying on internet articles to solve your problems if you don't want headaches in future.


## Corrections

This article may not be completely accurate, although I have tried to ensure that it is. In case you find any inaccuracies, feel free to reach me out via email: yakshbari4@gmail.com, I'd be happy to correct this article.
