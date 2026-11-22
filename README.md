# 42 Web Cybersecurity Final Project

## Introduction

This project demonstrates several common web security vulnerabilities through a browser-based application.

## Team Members

- [@itshakemd](https://github.com/itshakemd)
- [@malekelyan77-debug](https://github.com/malekelyan77-debug)
- [@Tala-sh](https://github.com/Tala-sh)
- [@yahia1-1](https://github.com/yahia1-1)
- [@Laith-Elsalah](https://github.com/Laith-Elsalah)

## Clickjacking

Clickjacking hides or disguises a legitimate interface so users accidentally click something they did not intend to click.

**Risks**

- Unauthorized actions
- Accidental account changes
- Activation of hidden buttons

**Prevention**

- Set `X-Frame-Options: DENY`
- Configure CSP with `frame-ancestors 'none'`
- Require confirmation for sensitive actions
- Prevent sensitive pages from being embedded

## Client-Side Enforcement

Client-side enforcement relies on browser controls or JavaScript instead of secure server-side checks.

**Risks**

- Bypassing validation
- Unauthorized access
- Modifying prices, roles, or permissions
- Sending forged requests to the server

**Prevention**

- Validate all data on the server
- Never trust browser-submitted values
- Enforce permissions in backend code
- Reject invalid or unexpected requests

## Weak Randomness

Weak randomness occurs when predictable values are used for security-sensitive purposes.

**Risks**

- Guessable session IDs
- Predictable password-reset tokens
- Session hijacking
- Forged authentication tokens

**Prevention**

- Use a cryptographically secure random generator
- Generate long, unpredictable tokens
- Never use predictable values for authentication
- Invalidate tokens after use or expiration
