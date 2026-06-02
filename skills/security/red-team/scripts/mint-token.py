#!/usr/bin/env python3
"""Forge a JWT for authorization-bypass testing against a target you own.

Use when you possess a dev/test signing key or HMAC secret for the app under test. A validly-signed
token with attacker-chosen claims tests whether the server re-validates authorization server-side
or merely trusts the token's claims (the A4 attack in playbook-access-control.md).

Examples
--------
  # RS256/ES256 with a private key (PEM or PKCS12), arbitrary claims:
  python3 mint-token.py --key dev-signing.pem --alg RS256 \
      --iss https://iam.local/ --aud my-app \
      --claim sub=USER_A --claim orgId=TENANT_B --claim role=admin

  # PKCS12 (.pfx/.p12) with a password (use "" for an empty dev password):
  python3 mint-token.py --key dev.pfx --pkcs12 --key-pass "" --alg RS256 --claim sub=victim

  # HS256 with a shared secret:
  python3 mint-token.py --secret 's3cr3t' --alg HS256 --claim sub=USER_A --claim admin=true

Dependencies: pyjwt, cryptography  (pip install pyjwt cryptography)
"""
import argparse, json, sys, time


def load_signing_material(args):
    """Return the key/secret object PyJWT will sign with."""
    if args.secret is not None:
        return args.secret  # HMAC
    if not args.key:
        sys.exit("error: provide --secret (HS*) or --key (RS*/ES*/PS*)")
    raw = open(args.key, "rb").read()
    if args.pkcs12:
        from cryptography.hazmat.primitives.serialization import pkcs12, Encoding, PrivateFormat, NoEncryption
        pw = args.key_pass.encode() if args.key_pass is not None else None
        key, _cert, _chain = pkcs12.load_key_and_certificates(raw, pw)
        return key.private_bytes(Encoding.PEM, PrivateFormat.PKCS8, NoEncryption())
    return raw  # PEM private key (optionally encrypted -> PyJWT handles via password kwarg)


def coerce(v):
    """Turn CLI string values into bool/int/json where it makes sense."""
    if v in ("true", "false"):
        return v == "true"
    if v.lstrip("-").isdigit():
        return int(v)
    if (v.startswith("{") and v.endswith("}")) or (v.startswith("[") and v.endswith("]")):
        try:
            return json.loads(v)
        except ValueError:
            pass
    return v


def main():
    p = argparse.ArgumentParser(description="Forge a JWT for authz testing.")
    p.add_argument("--key", help="path to private key (PEM) or PKCS12 (.pfx/.p12)")
    p.add_argument("--pkcs12", action="store_true", help="--key is a PKCS12 bundle")
    p.add_argument("--key-pass", default=None, help='password for the key/PKCS12 (use "" if empty)')
    p.add_argument("--secret", default=None, help="HMAC secret (for HS256/384/512)")
    p.add_argument("--alg", default="RS256", help="signing alg (default RS256)")
    p.add_argument("--iss", help="issuer claim")
    p.add_argument("--aud", help="audience claim")
    p.add_argument("--exp-minutes", type=int, default=60, help="expiry from now (default 60)")
    p.add_argument("--no-exp", action="store_true", help="omit exp (test expiry handling)")
    p.add_argument("--kid", help="set the JWT header 'kid'")
    p.add_argument("--claim", action="append", default=[], metavar="k=v",
                   help="add a claim; repeatable. Values auto-cast bool/int/json.")
    args = p.parse_args()

    try:
        import jwt  # PyJWT
    except ImportError:
        sys.exit("error: pip install pyjwt cryptography")

    now = int(time.time())
    payload = {"iat": now, "nbf": now}
    if not args.no_exp:
        payload["exp"] = now + args.exp_minutes * 60
    if args.iss:
        payload["iss"] = args.iss
    if args.aud:
        payload["aud"] = args.aud
    for item in args.claim:
        if "=" not in item:
            sys.exit(f"error: --claim must be k=v, got {item!r}")
        k, v = item.split("=", 1)
        payload[k] = coerce(v)

    key = load_signing_material(args)
    headers = {"kid": args.kid} if args.kid else None
    # PEM private keys that are encrypted: PyJWT accepts a password via the key being a
    # cryptography key object; for simplicity we pass raw PEM (unencrypted dev keys are the norm).
    token = jwt.encode(payload, key, algorithm=args.alg, headers=headers)
    print(token if isinstance(token, str) else token.decode())


if __name__ == "__main__":
    main()
