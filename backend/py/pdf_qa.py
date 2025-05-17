import sys
import fitz 
from transformers import pipeline

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text.strip()

def ask_question_from_pdf(pdf_text, question):
    context = pdf_text[:4000]

    qa_pipeline = pipeline("question-answering", model="deepset/roberta-base-squad2")

    result = qa_pipeline({
        'context': context,
        'question': question
    })

    if result['score'] < 0.3 or result['answer'].strip() == "":
        return "Sorry, I could not find an answer in the PDF."

    return result['answer']

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