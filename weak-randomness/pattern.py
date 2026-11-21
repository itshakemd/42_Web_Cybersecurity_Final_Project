
#!/usr/bin/env python3

"""
Weak Randomness Lab - Pattern Predictor

Educational offline simulation.
Generates candidate tokens using an observed
constant-step sequence.
"""

MODULUS = 1_000_000
MAX_CANDIDATES = 20


def generate_candidates(last_token, step, count):
    candidates = []
    current = last_token

    for _ in range(count):
        current = (current + step) % MODULUS
        candidates.append(f"{current:06d}")

    return candidates


def main():
    print("=== Weak Randomness Pattern Predictor ===")
    print("Offline educational simulation\n")

    try:
        last_token = input("Last observed token: ").strip()
        step_input = input("Observed difference: ").strip()
        count_input = input("Number of candidates (1-20): ").strip()

        if not (len(last_token) == 6 and last_token.isdigit()):
            raise ValueError("Token must contain six digits.")

        step = int(step_input)
        count = int(count_input)

        if not 1 <= step < MODULUS:
            raise ValueError("Difference must be between 1 and 999999.")

        if not 1 <= count <= MAX_CANDIDATES:
            raise ValueError("Choose between 1 and 20 candidates.")

        candidates = generate_candidates(
            int(last_token),
            step,
            count
        )

        print("\n=== Candidate Tokens ===")

        for token in candidates:
            print(token)

        with open("candidates.txt", "w", encoding="utf-8") as file:
            file.write("\n".join(candidates) + "\n")

        print("\nSaved to candidates.txt")
        print("Copy the tokens into the lab simulation.")

    except ValueError as error:
        print(f"\nError: {error}")


if __name__ == "__main__":
    main()
