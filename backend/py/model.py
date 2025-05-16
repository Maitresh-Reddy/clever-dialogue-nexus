import sys
from transformers import pipeline, set_seed

def ask_huggingface(prompt):
    generator = pipeline(
        "text-generation",
        model="gpt2",
        pad_token_id=50256
    )
    set_seed(42)

    result = generator(
        prompt,
        max_length=150,
        do_sample=True,
        truncation=True
    )
    generated=result[0]["generated_text"]
    # answer = generated[len(prompt)-1:].strip()
    return generated

def main():
    if len(sys.argv) < 2:
        print("Usage: python model.py \"your prompt here\"")
        sys.exit(1)

    prompt = " ".join(sys.argv[1:])
    try:
        answer = ask_huggingface(prompt)
        print("\nAnswer:\n", answer)
    except Exception as e:
        print("Python error:", e)

if __name__ == "__main__":
    main()