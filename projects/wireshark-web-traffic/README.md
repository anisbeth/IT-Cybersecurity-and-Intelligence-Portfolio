# Wireshark for Packet Capture: Analyzing Web Traffic

- **Course:** Coursera Guided Project, *Wireshark for Packet Capture: Analyze Web Traffic* (October 2026)
- **Certificate:** [View verified certificate](https://coursera.org/share/84329a1fc8697cb4a70f5d650b20459e)
- **Tools:** Wireshark 4.4.0, Ubuntu (cloud lab desktop), Google Chrome
- **My level:** Third Wireshark project (builds on [P001: Wireshark TCP/IP Fundamentals](../wireshark-tcp-ip/) and P002: Detecting Network Anomalies)

## Why I Did This Project
I'm building hands-on cybersecurity skills as I work toward a cyber intelligence analyst
role. My first two projects taught me to read normal traffic and spot attacks. This time I
wanted to learn how to troubleshoot web traffic: figure out *why* a page is slow or broken,
and tell whether the problem is the network, the server, or the user. I wrote this page as
a record of what I did, step by step, so I can repeat it later.

## Quick Glossary (terms I had to learn first)
- **Capture filter vs. display filter:** a capture filter decides what gets *recorded* (like
  a bouncer at the door). A display filter only *hides* packets after recording (like
  sunglasses). Anything a capture filter drops is gone for good.
- **Hexadecimal (hex):** another way of writing numbers, using 0–9 and a–f. `1f 90` in hex
  is 8080 in normal numbers. Same value, different notation.
- **HTTP vs. HTTPS:** HTTP is plain text that anyone on the path can read. HTTPS is encrypted.
- **Status codes:** the server's reply type. 200 = OK, 301 = moved permanently, 404 = not found.
- **User-Agent:** the part of a request that tells the server which browser and operating system you use.
- **DNS:** the internet's phone book. It turns names like neverssl.com into IP addresses.
- **Transaction ID:** a ticket number on each DNS question. The answer comes back with the same number.
- **NXDOMAIN / SERVFAIL:** DNS error codes. NXDOMAIN means "that name doesn't exist." SERVFAIL means "the server couldn't answer."
- **Three-way handshake:** how TCP connections start: SYN ("hello?") → SYN-ACK ("hello, I hear you") → ACK ("great, let's talk").
- **Retransmission:** a packet that had to be sent again because it was lost.
- **RTT (round-trip time):** how long it takes for a "got it" to come back. The network's echo.
- **TCP window:** how much data a receiver can accept at once, like the size of an inbox.

---

## Task 1: Exploring Wireshark's Interface

**What I did:**
1. Started a capture on the `eth0` interface.
2. Noticed that almost everything was on **port 6901**. That's the lab's remote-desktop
   stream (my own screen being sent to my browser), not real network activity.
3. Hid the noise with the display filter `!(tcp.port == 6901)`. That took 6,127 packets
   down to 30.
4. Clicked **Destination Port** in the packet details and watched the matching bytes
   (`8f cc` = 36812) light up in the hex pane.
5. Saved the capture as `task1-capture.pcapng`.

![Unfiltered capture full of remote-desktop noise](01-unfiltered-capture-vnc-noise.png)
![Noise filtered out](01b-noise-filtered-out.png)
![Details pane linked to hex bytes](01c-details-bytes-link.png)

**What I noticed:**
- The gateway asked "Who has 172.18.0.43?" about once a second and never got an answer. That's
  a device that went offline.
- Wireshark's status bar shows a field's filter name (`tcp.dstport`) when you click it, so I
  don't have to memorize filter syntax.

**Why this matters for an analyst:** On real networks, step one is always filtering out
known-good noise (backups, monitoring, remote desktop) so the unusual stuff stands out.

---

## Task 2: Capturing, Filtering, and Saving Traffic

**What I did:**
1. Opened **Capture → Options**, selected `eth0`, and set the capture filter `not port 6901`.
2. Started the capture. With nothing else happening, it recorded **zero packets**, which
   proved the filter worked.
3. Started a new capture and browsed to `http://neverssl.com` and `http://example.com`.
4. Stopped at 3,667 packets and saved as `task2-web-traffic-2026-10-04.pcapng` (a meaningful
   name with a date, as the course recommends).

![Capture filter set](02-capture-filter-set.png)
![Zero packets: proof the filter worked](02b-zero-packets-filter-proof.png)
![Web traffic captured](02c-web-traffic-captured.png)

**What I noticed:** Dozens of **TCP Keep-Alive** packets went to Google servers even when I
wasn't doing anything. Chrome holds background connections open, so a quiet computer is never
truly quiet on the network.

---

## Task 3: HTTP & Web Traffic Analysis

**What I did:**
1. Filtered with `http.request` and found 5 requests, all to `34.223.124.45` (neverssl.com).
2. Opened a request and read its headers: **Host**, **User-Agent** (Chrome 130 on Linux), and more.
   In the hex pane I could read `GET / HTTP/1.1` in plain text, which is what "unencrypted" means.
3. Filtered with `http.response` and matched each request to its response.
4. Found one request with **no response**, then followed its whole conversation with `tcp.port == 49572`.

![HTTP requests](03-http-requests.png)
![Request headers](03b-http-request-headers.png)
![HTTP responses](03c-http-responses.png)
![The request that never got an answer](03d-unanswered-request.png)

**Matching requests to responses:**

| Request | Response | Meaning |
|---|---|---|
| 596 `GET /` | **None** | Server never answered |
| 659 `GET /` | 667 **200 OK** | Page delivered (Chrome's retry) |
| 726 `GET /online` | 731 **301 Moved Permanently** | Redirect to `/online/` |
| 733 `GET /online/` | 741 **200 OK** | Page delivered |
| 743 `GET /favicon.ico` | 746 **200 OK** | Tab icon delivered |

**The unanswered request:** The handshake worked, and the server even **acknowledged
receiving the request** (packet 597). Then it went silent for about 11.6 seconds until Chrome
gave up and closed the connection. Chrome got the page on a second connection it had already
opened as a backup.

**Why this matters for an analyst:** Packet 597 proves the network delivered the request, so
this was a **server problem, not a network problem**. Telling those apart is the core skill
of web troubleshooting.

**Also noticed:** example.com never showed up as HTTP. Chrome quietly upgraded it to HTTPS (encrypted).

---

## Task 4: DNS & Network Discovery

**What I did:**
1. Filtered with `dns`: 260 DNS packets, all between my machine and the lab gateway.
2. Found slow lookups with `dns.time > 0.03`. Only 4 took longer than 30 ms, and the slowest was 0.16s.
3. Matched a question to its answer by transaction ID with `dns.id == 0x7c04`.
4. Found failed lookups with `dns.flags.rcode != 0`, then removed harmless "Not implemented"
   errors with `dns.flags.rcode != 0 && dns.flags.rcode != 4`.

![All DNS traffic](04-dns-traffic.png)
![Slow DNS responses](04b-slow-dns-responses.png)
![Query and response matched by transaction ID](04c-dns-query-response-pair.png)
![All DNS errors](04d-dns-errors.png)
![Real DNS failures only](04e-real-dns-failures.png)

**What I noticed:**
- **neverssl.com resolved** to `34.223.124.45` in 0.035s, the same IP from Task 3.
- **A random-looking name:** `wholelushclearlaugh.neverssl.com`. neverssl creates random
  subdomains on purpose so browsers can't cache the page. That looks like malware's domain
  generation, but here it was harmless.
- **My typo caused errors:** I typed `example` without `.com`. That caused 10 failed lookups
  in two quick bursts, and then Chrome searched Google instead.
- **The lab runs on Amazon:** my computer automatically tried `example.ec2.internal`, which
  revealed the lab is hosted on AWS EC2.

**Why this matters for an analyst:** A random-looking domain alone isn't proof of malware.
Check the volume, the cause, and what happens next. A typo makes a few failures and stops.
Malware makes many failures over time and then connects to whatever finally works.

---

## Task 5: TCP/IP & Performance Analysis

**What I did:**
1. Found every new connection with `tcp.flags.syn == 1 && tcp.flags.ack == 0`.
2. Checked for lost packets with `tcp.analysis.retransmission`.
3. Checked for slow round trips with `tcp.analysis.ack_rtt > 0.05`.
4. Checked for full buffers with `tcp.analysis.zero_window || tcp.analysis.window_full`.

![New connections (SYN)](05-tcp-syn-packets.png)
![Retransmissions](05b-tcp-retransmissions.png)
![High round-trip times (none)](05c-high-rtt.png)
![Window problems (none)](05d-window-problems.png)

**Health report:**

| Check | Result | Verdict |
|---|---|---|
| New connections | 63 in ~63 seconds | Normal browsing |
| Retransmissions | 3 of 3,667 (0.08%), all from one Google server | Healthy |
| RTT over 50 ms | 0 | Fast (cloud-to-cloud) |
| Zero / full window | 0 | No bottlenecks |

**What I noticed:** Chrome opened **two connections to neverssl at the same moment**
(packets 590 and 593). That's a speed trick called preconnect, and it explains why Chrome
recovered from the stuck request in Task 3.

**Why this matters for an analyst:** An empty result is still evidence. "I checked and found
none" rules out a cause, which is half of troubleshooting.

---

## Filters Cheat Sheet

| Filter | Type | What it does |
|---|---|---|
| `not port 6901` | Capture | Doesn't record the lab's remote-desktop noise at all |
| `!(tcp.port == 6901)` | Display | Hides remote-desktop noise after capture |
| `http.request` | Display | Requests the browser sent |
| `http.response` | Display | Server replies with status codes |
| `tcp.port == 49572` | Display | One whole conversation |
| `dns` | Display | All DNS lookups |
| `dns.time > 0.03` | Display | DNS answers slower than 30 ms |
| `dns.id == 0x7c04` | Display | One DNS question and its answer |
| `dns.flags.rcode != 0 && dns.flags.rcode != 4` | Display | Real DNS failures only |
| `tcp.flags.syn == 1 && tcp.flags.ack == 0` | Display | Start of every new connection |
| `tcp.analysis.retransmission` | Display | Lost packets that were re-sent |
| `tcp.analysis.ack_rtt > 0.05` | Display | Slow round trips |
| `tcp.analysis.zero_window \|\| tcp.analysis.window_full` | Display | Full receive buffers |

---

## What I Learned: My Notes

### Tool basics
- Clicking a byte in the hex pane jumps to its field in the details pane (and the other way around).
- The status bar shows a field's filter name when you click it.
- A custom "Response Time" column only fills in for protocols that have response times, like DNS.

### Interesting finds
- **The loudest traffic was me again:** the remote-desktop stream was 77% of the capture.
- **A server that ignored me:** it confirmed receiving my request and then never answered.
- **Chrome checks sites first:** a Safe Browsing lookup happened right as I visited neverssl.
- **A typo leaked infrastructure:** my failed lookup revealed the lab runs on AWS.

### Knowledge checks I answered
- **Why do 8080 and `1f 90` mean the same thing?** I didn't know. I learned hex is just another
  way to write numbers, and analysts need it when Wireshark can't decode traffic.
- **When does each filter type work?** Capture filters work during capture, display filters
  after. ✅ I also learned capture filters can't be undone.
- **Network or server issue?** Server. ✅ I first pointed to packet 658, but the proof is
  packet 597, where the server acknowledged my request.
- **Why were the `example` lookups harmless?** I typed it without `.com`. ✅ The evidence:
  low volume, a known cause, and normal activity afterward.
- **First two checks for "the internet is slow"?** RTT ✅. I picked handshakes second, but
  retransmissions are the better pick because lost packets are what users feel as slowness.

### Mistakes I made (and what fixed them)
- The packet pop-up window's hex pane didn't track my clicks. I clicked the hex bytes
  directly instead. **Lesson:** lab displays glitch, so try another route.
- My first capture was almost all noise. I used a capture filter the second time.
- I typed `example` instead of `example.com`. It turned into a useful DNS lesson.
