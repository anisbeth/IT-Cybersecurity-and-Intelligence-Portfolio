# Analyze Network Traffic with TCPDump: Building a Logging Tool

- **Course:** Coursera Guided Project, *Analyze Network Traffic with TCPDump: Build a Logging Tool* (October 2026)
- **Certificate:** [View verified certificate](https://coursera.org/share/61cc728807c8d36030c468e368adee13)
- **Tools:** tcpdump 4.9.3, Wireshark 4.4.9, Bash, curl, Ubuntu 20.04 (Azure lab VM over RDP)
- **My level:** Fourth packet analysis project, and my first one on the command line (builds on [P003: Wireshark for Packet Capture](../wireshark-web-traffic/))

## Why I Did This Project
I'm building hands-on cybersecurity skills as I work toward a cyber intelligence analyst
role. My first three projects all used Wireshark's point-and-click interface. Real sensors
and servers usually don't have a screen, so I wanted to learn tcpdump: capturing traffic
from the command line, automating it with a script, and saving evidence in a way an
analyst can actually use later. I wrote this page as a record of what I did, step by step,
so I can repeat it later.

**Note:** This course had no cloud lab, so I set up my own environment. I used my CodePath
CYB102 Ubuntu VM, which runs in Azure, and connected to it over Remote Desktop (RDP).

## Quick Glossary (terms I had to learn first)
- **tcpdump:** Wireshark without the windows. If Wireshark is watching security camera
  footage on a monitor, tcpdump is the camera's recorder in the back closet.
- **Interface:** the network connection you listen on. Mine was `eth0`.
- **pcap file:** a saved recording of packets. tcpdump writes them, and Wireshark can open them.
- **Root / sudo:** administrator rights. Listening on a network interface requires them.
- **Privilege drop:** tcpdump starts as root, then switches to a weaker account so a
  malicious packet can't take over the whole machine.
- **Bash script:** a text file of commands that runs like a program. My logging tool is one.
- **File rotation:** starting a new capture file after a set time or size, so no single file gets huge.
- **Ring buffer:** a fixed number of files that get reused in a loop. The oldest data is overwritten.
- **TLS / HTTPS:** encryption for web traffic. Without the keys, you see that data moved but not what it was.
- **SSLKEYLOGFILE:** a setting that tells a program to save its encryption keys to a file, so the traffic can be decrypted later.
- **SNI (Server Name Indication):** the website name a client sends at the start of an
  HTTPS connection. It isn't encrypted, so it's visible even when everything else is.

## tcpdump Options I Used

| Option | What it does |
|---|---|
| `-i eth0` | Listen on one interface |
| `-c 10` | Stop after 10 packets |
| `-n` | Show raw IPs; don't look up hostnames |
| `-#` | Number each packet |
| `-tttt` | Full date and time on each packet |
| `-A` | Show the packet contents as text |
| `-XX` | Show the packet contents as hex and text |
| `-w file.pcap` | Write packets to a file instead of the screen |
| `-r file.pcap` | Read a saved file back |
| `-G 10` | Start a new file every 10 seconds |
| `-C 1` | Start a new file every 1 million bytes |
| `-W 3` | Keep only 3 files |
| `-Z codepath` | Drop privileges to my account instead of the `tcpdump` account |

---

## Task 1: Getting Started

**What I did:** I confirmed tcpdump and Wireshark were installed, found my network
interface, and practiced different ways of displaying packets.

![Environment check](01-environment-check.png)

My VM's main interface was `eth0`. tcpdump was already installed, and I upgraded
Wireshark from 4.0.6 to 4.4.9 along the way.

My first capture (no screenshot) caught one complete conversation between my VM and
`168.63.129.16`. That's Azure's WireServer, a fixed address every Azure VM checks in with
for instructions. I could see the whole thing as text: handshake, request, reply, goodbye.
That capture also said **7 packets dropped by kernel**.

![Line numbers and timestamps](03-line-numbers-timestamps.png)

Adding `-n -# -tttt` gave me line numbers and full dates, and **0 packets dropped**. The
drops happened because tcpdump was pausing to look up a hostname for every IP address.
Every packet here was port 443 (HTTPS), so I could see sizes but not content.

![HTTP payload as text](04-ascii-http-payload.png)

With `-A` and plain HTTP, I could read the whole conversation: my `GET` request, the
server's `200 OK`, and the web page itself. The reply came from Cloudflare's Ashburn data
center. My first try failed because Azure's own traffic filled my 10-packet limit before
my request got there, so I excluded it with `not host 168.63.129.16`.

That capture also caught my VM asking Azure's **Instance Metadata Service**
(`169.254.169.254`) for details about itself, in plain text. I left those details out of
my screenshots because they included account IDs.

![Same traffic in hex](05-hex-payload.png)

`-XX` shows every byte. I color-coded the layers like envelopes inside envelopes: Ethernet
addresses (blue), the IPv4 marker `0800` (orange), IP addresses (purple), ports (red), and
the HTTP request (yellow). For example, `0050` in hex is port 80.

**Why this matters for an analyst:** Hex is how you catch what the summary hides, like
hidden data or a protocol running on a port it doesn't belong on.

---

## Task 2: Building the Logging Tool Script

**What I did:** I put my tcpdump command into a script called `logger.sh`, then used
filters to target specific traffic.

![First version of the script](06-logger-script-v1.png)

Pasting into the terminal editor didn't work, so I created the file straight from the
command line instead (see Mistakes below). The script worked on the first run.

![Host filter](07-logger-host-filter.png)

`host example.com` captured only my conversation with that one site. One targeted filter
did the job of the three "exclude this" rules I'd been stacking up.

![Outgoing traffic on port 80](08-logger-dst-port.png)

`dst example.com and port 80` captured only my side of the conversation. The server's
replies were missing, but my acknowledgments (`ack 931`, `ack 936`) still proved exactly
how many bytes the server had sent me.

**Why this matters for an analyst:** One-sided captures happen in real networks. The
acknowledgment numbers let you work out how much data the other side sent, which matters
when you're checking whether data was stolen.

---

## Task 3: Saving Captures to a File

**What I did:** I wrote packets to a file, read them back, and opened the file in Wireshark.

![Writing to a dump file](09-write-dump-file.png)

With `-w`, nothing printed to the screen. The packets went straight to disk. The file was
owned by a user called `tcpdump`, not me, which is the privilege drop in action.

![Reading the dump file](10-read-dump-file.png)

`-r` replayed the file without `sudo`, because reading a file doesn't touch the network
interface. It showed both of my requests. The second conversation had no ending, because
my 20-packet limit cut the capture off mid-conversation.

![The dump file in Wireshark](11-dump-in-wireshark.png)

Wireshark opened the same file, and the `http` filter narrowed 20 packets to 4: two
requests and two replies. Wireshark also identified my network card as Microsoft's,
because Azure VMs run on Microsoft's Hyper-V.

**Why this matters for an analyst:** This is the normal workflow: capture lean with
tcpdump on the server, then analyze in Wireshark on your own machine. Only the capture
step needs admin rights.

---

## Task 4: Rotating Capture Files

**What I did:** I made the script start new files based on time and on size.

![Time-based rotation](12-time-rotation.png)

My first try failed with **Permission denied**. tcpdump created the first file as root,
dropped to the `tcpdump` account, and then wasn't allowed to create the next file in my
folder. Adding `-Z codepath` fixed it. I got three files exactly 10 seconds apart, each
named with its start time. The third was empty because tcpdump hit its 3-file limit right
after opening it.

![Size-based rotation](13-size-rotation.png)

With `-C 1 -W 3`, my first test only produced one 753K file, because 50 small web requests
weren't enough traffic. Downloading a 5 MB test file filled three files (980K, 978K, and
488K). The files only held about 2.4 MB of a 5 MB download, which tells me tcpdump looped
around and overwrote the oldest files.

**Why this matters for an analyst:** Ring buffers keep a sensor running without filling the
disk, but they lose old data on purpose. If nobody notices an incident before the buffer
loops, the evidence is gone.

---

## Task 5: Decrypting HTTPS Traffic

**What I did:** I captured an HTTPS request while saving its encryption keys, then used
Wireshark to decrypt it.

![Capture with key logging](14-tls-capture-keylog.png)

I set `SSLKEYLOGFILE` and made the request with curl. The key file's labels show it used
TLS 1.3. I blurred the actual key values.

![Encrypted traffic](15-tls-encrypted.png)

Before decryption, Wireshark only showed "Application Data." The one readable detail was
the website name, `example.com`, in the Client Hello.

![Decrypted traffic](16-tls-decrypted.png)

After I pointed Wireshark to the key file (Edit → Preferences → Protocols → TLS), the
same packets showed the request, the `200 OK`, and the page. It was **HTTP/2**, not HTTP/1.1,
so the `http` filter didn't match; `http2` does. I could also now see the server's
certificate, which TLS 1.3 encrypts.

**Why this matters for an analyst:** Even when you can't decrypt traffic, the website name
tells you where a machine connected. And a key log file is as sensitive as a password,
since it unlocks every session it covers.

---

## My Final Logging Script

```bash
#!/bin/bash
# P004 TCPDump logging tool - rotate files every 10 seconds
sudo tcpdump -i eth0 -n -Z codepath -G 10 -W 3 -w ~/p004/rot-%H%M%S.pcap not port 3389
```

---

## What I Learned: My Notes

### Tool basics
- tcpdump needs `sudo` to capture, but not to read a saved file.
- `-n` should almost always be on. Hostname lookups slow tcpdump down and add extra traffic to your own capture.
- Without `%H%M%S` in the filename, `-G` keeps overwriting the same file.
- A packet count limit (`-c`) can cut a conversation off in the middle.

### Interesting finds
- **My own remote desktop was noise again:** RDP uses port 3389, so I filtered it out of every capture.
- **Azure talks to itself constantly:** the WireServer and the metadata service showed up all the time.
- **The metadata service is unencrypted:** its replies included account details. That's why attackers target it (the 2019 Capital One breach used it).
- **HTTPS still leaks the site name:** the Client Hello showed `example.com` in plain text.

### Knowledge checks I answered
- **Why did `-n` stop the dropped packets?** I picked "it filtered out Azure traffic." The
  answer is that it stopped DNS lookups. `-n` changes how packets are shown, not which ones are kept.
- **Which filter catches traffic *from* one IP on port 22?** I skipped this one. The answer
  is `src 45.33.32.156 and port 22`. Using `or` would grab all port 22 traffic.
- **Why didn't `-r` need sudo?** I picked "`-r` runs as root automatically." The answer is
  that reading a file doesn't touch the network interface.
- **What does `-G 60` do without time codes in the filename?** I skipped this one. The answer
  is that it keeps overwriting one file, so only the last 60 seconds survive.

### Mistakes I made (and what fixed them)
- Two commands ran together on one line and caused an error. I ran them separately.
- Ctrl+V doesn't paste in a Linux terminal. Ctrl+Shift+V does, but the editor still wouldn't take it, so I created the script with a `cat << 'EOF'` command instead.
- `-G` failed with "Permission denied" because of the privilege drop. `-Z codepath` fixed it.
- `rm` asked to confirm deleting a file owned by `tcpdump`, and I pressed Enter, which means no. `rm -f` fixed it.
- My first `-C` test didn't create enough traffic to rotate. A bigger download did.
### Files I did not upload
The capture files and the key log aren't in this repo on purpose. The key log could
decrypt the session it recorded, so I handle it like a password.
