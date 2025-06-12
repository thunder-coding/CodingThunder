---
author: "Yaksh Bariya"
title: "Update to my GPG keys"
description: "I have updated my GPG keys, please import the new keys and update your keyrings."
tags: ["identity", "gpg", "key", "security"]
publishdate: "2025-06-13T00:00:00+05:30"
---

I have updated my GPG keys. A copy of the new keys is [available on my website at https://thunders.website/yaksh.gpg](https://thunders.website/yaksh.gpg).

This is a periodic rotation of secrets, and all my devices to the best of my knowledge are not compromised. Kindly import the new keys so that you can verify my signatures/send me private messages as usual.

> [!WARNING]
> The old keys had no expiry when I created and circulated them, please make sure that after importing the keys from my website, they have an expiry date set to 2035-06-10. If you find that the keys do not have an expiry date, please delete them and re-import the keys from my website.


## Importing the new keys

You can import the new keys using the following command:

```bash
curl https://thunders.website/yaksh.gpg -o yaksh.gpg
gpg --import yaksh.gpg
```

## Key fingerprints

Old key fingerprint (make sure you verify the expiry date of the key):
```
pub   ed25519 2021-05-08 [SC] [expires: 2026-06-12]
      6E519146C7A2B81BBF801A9CF7486BA7D3D27581
uid           [ultimate] Yaksh Bariya <thunder-coding@termux.dev>
uid           [ultimate] Yaksh Bariya <thunder@termux.org>
uid           [ultimate] Yaksh Bariya <yakshbari4@gmail.com>
sub   cv25519 2021-05-08 [E]
```

New key fingerprint (set to expire 10 years as of writing this post):
```
pub   ed25519 2025-06-12 [SC] [expires: 2035-06-10]
      94104F935B5362B3150EB7C1FDD928D965207016
uid           [ultimate] Yaksh Bariya <thunder-coding@termux.dev>
uid           [ultimate] Yaksh Bariya <yakshbari4@gmail.com>
sub   cv25519 2025-06-12 [E] [expires: 2035-06-10]
```

## Signed message

The below signed message is signed with my old key, stating that I have updated my keys. You can verify the signature using the old key fingerprint above. This should serve as a proof that the new keys are indeed from me and not someone else.

```
-----BEGIN PGP MESSAGE-----

owG9lDtoFEEYx88YBVfEIJhCDXza+CC32d27vUcQSTZ3F+NbEhAJV8zdTm4n2Z1Z
d2buciD4qCxjY+UDbKxEm4CIaKEgWihERBsrQdBKtDCVOru5KBIUbdxuvpn///v+
vx1mbsPqlNb7Zf/MjRcL8tyqm91ObX2AOUcNrItZ4R3c9mTCIxw6NWghDq2ICIEp
MAoHJMVgWuAjgYGShidg19j4xG4dxvrhJJrhHjgoIm0EHmpiCFgTuyAYIKC4BaPH
RmEGt3VNm/BwUlErUN0QlEuWbZvFpDAtuQCfzGAQ6lgY4SZhkqv2uB84AyKAe0z6
LtQwcDSFYSpiAZySiAoZQJ0FoRQ44jrEXWLDzvHY0m//VLEITAPaGEUccFMFRFNK
B8htIlrHAaaCA6EdQ0IbELIWjnRt2HWJIIwiX7nFIzLfVbq4E2UtlVwFooBnQxKp
3lgkU7eZ3On7S1gUkAiTIGSRUGl0OMkk1JVkilA3MZShqwC7sWWcGzwhQj44MCA8
Sd04WgvXOBF4oB0j1xthQ9OO+sn52KSBozAiVAxqoawBAHaX4FqGZaYNO20UYHJ8
pAqTyYyYD8Y7ubSRS5tWVYPky5WVwszmRvLDllMwHadSMMzh4kglny3knOF8KVOy
8nbB1CRx4ec3KX1BAjV89dfrsLczerrOXDXgkAIdyFndxc19/+iwLGVR46+lCaaa
WmSHGgEivq7+6T6NJ3DqzZVwylVNO9K5nn/maS9RW8kzs7RjLPMsZk0jWylmbMfO
5CwnY9pG2cmPmJVSqWgVSsWcbRl5w8z9P55/CeVHwvLvAl6Q3aleLdXXu72bHr9Y
eXz9ztYHZ7dcXn5k1nTFr0pKW9ezXDk/kfpGpx/2fTwzlp8/fevw1fPz74Zuvznx
6dJbZ/fCxvbang/3Ul/3vL62f+7Z/VdXsk93bAoWTy0Gdw99fpTdXH3+sv99aXPX
dw==
=FYP0
-----END PGP MESSAGE-----
```

You can verify the signature using the following command (make sure you have my old key in your keyring first):
```bash
# First save the abovee pgp signed message to a file, say message.asc
gpg --decrypt message.asc

```

You should see a message printed out containing the my old as well as new key fingerprints.
