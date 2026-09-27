# Wireshark: TCP/IP Protocol Fundamentals

**Source:** Coursera Guided Project (Sept 2026)
**Tools:** Wireshark, Linux CLI (ping), Firefox

## Objective
Capture and analyze live traffic to identify TCP/IP layers, the TCP three-way
handshake, HTTP request/response flow, and the TLS handshake.

## What I Did
1. Captured traffic on the ethernet interface (ens5) and saved it to .pcapng
2. Isolated a host's traffic with `ip.addr == <IP>` after resolving it via ping
3. Identified SYN → SYN/ACK → ACK and tracked sequence/ack numbers
4. Followed an HTTP GET, the server's HTML response, and FIN/ACK teardown
5. Compared HTTPS traffic: Client Hello, Server Hello, Change Cipher Spec

![Three-way handshake](03-three-way-handshake.png)

## Key Findings
- (What you noticed, e.g. HTTP payload readable in cleartext; HTTPS payload encrypted)

## Analyst Relevance
How packet analysis supports intrusion detection, attribution, and
validating indicators of compromise.
