import sys
import fitz  # PyMuPDF
from transformers import pipeline

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text.strip()

def split_text(text, max_length=1500):
    return [text[i:i + max_length] for i in range(0, len(text), max_length)]

def ask_question_from_pdf(pdf_text, question):
    generator = pipeline("text2text-generation", model="google/flan-t5-base")

    chunks = split_text(pdf_text, max_length=1500)

    responses = []
    for chunk in chunks[:3]:  # Search top 3 chunks only
        prompt = f"Answer the question based only on this text:\n\n{chunk}\n\nQuestion: {question}"
        result = generator(prompt, max_length=300, do_sample=True, temperature=0.7)
        responses.append(result[0]['generated_text'].strip())

    # Combine all chunked answers
    return "\n---\n".join(responses)

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