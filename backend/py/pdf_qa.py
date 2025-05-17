import sys
import fitz
from transformers import pipeline, set_seed

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def ask_question_from_pdf(pdf_text, question):
    prompt = f"{pdf_text[:1000]}\n\nQuestion: {question}\nAnswer:"
    generator = pipeline(
        "text-generation",
        model="gpt2",
        pad_token_id=50256
    )
    set_seed(42)
    result = generator(prompt, max_length=200, do_sample=True, truncation=True)
    return result[0]["generated_text"]

def main():
    if len(sys.argv) < 3:
        print("Usage: python pdf_qa.py <pdf_path> \"your question here\"")
        sys.exit(1)

    pdf_path = sys.argv[1]
    question = " ".join(sys.argv[2:])
    try:
        pdf_text = extract_text_from_pdf(pdf_path)
        answer = ask_question_from_pdf(pdf_text, question)
        print(answer)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    main()