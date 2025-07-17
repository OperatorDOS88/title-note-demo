import { useState } from "react";

function transformToTitleNote(input) {
  const cleaned = input.trim().replace(/\s+/g, " ");
  const bookPageMatch = cleaned.match(/book\s+(\d+)[,\s]*page\s+(\d+)/i);
  const legalMatch = cleaned.match(/(NW|NE|SW|SE)\/4/i);
  const grantorMatch = cleaned.match(/from\s+(.*?)\s+to/i);
  const granteeMatch = cleaned.match(/to\s+(.*?)(\.|,|$)/i);
  const dateMatch = cleaned.match(/(\b(?:19|20)\d{2}\b)/);
  const issueMatch = cleaned.match(/issue[:\-\s]+(.*)/i);

  const grantor = grantorMatch ? grantorMatch[1].trim() : "[Grantor]";
  const grantee = granteeMatch ? granteeMatch[1].trim() : "[Grantee]";
  const section = legalMatch ? legalMatch[0].toUpperCase() : "[Tract or Section]";
  const year = dateMatch ? dateMatch[1] : "[Year]";
  const book = bookPageMatch ? bookPageMatch[1] : "[Book]";
  const page = bookPageMatch ? bookPageMatch[2] : "[Page]";
  const issue = issueMatch ? issueMatch[1].trim() : "unclear conveyance language or formatting irregularities";

  return `In ${year}, ${grantor} conveyed all right, title, and interest in the ${section} by way of an instrument filed in Book ${book}, Page ${page}. The document appears to support the transfer, but there is a noted issue: ${issue}. For the purposes of this report, the examiner has treated the conveyance as valid and attributed interest to ${grantee}.`;
}

function App() {
  const [fieldNote, setFieldNote] = useState("");
  const [outputNote, setOutputNote] = useState("");

  const generateTitleNote = () => {
    const note = transformToTitleNote(fieldNote);
    setOutputNote(note);
  };

  return (
    <div>
      <h1>Title Note Generator (Demo)</h1>
      <textarea
        placeholder="Paste unstructured field note here..."
        value={fieldNote}
        onChange={(e) => setFieldNote(e.target.value)}
      />
      <br />
      <button onClick={generateTitleNote}>Generate Title Note</button>
      {outputNote && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff', border: '1px solid #ccc' }}>
          <h2>Structured Title Note:</h2>
          <p>{outputNote}</p>
        </div>
      )}
    </div>
  );
}

export default App;