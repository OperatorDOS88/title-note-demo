import { useState } from "react";

function transformToTitleNote(input) {
  const cleaned = input.trim().replace(/\s+/g, " ");

  // Pattern matchers
  const bookPageMatch = cleaned.match(/(?:book\s*)?(\d+)[\/\-,\s]+(?:page\s*)?(\d+)/i);
  const dateMatch = cleaned.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  const legalMatch = cleaned.match(/(NW|NE|SW|SE)[\/\\]4/i);
  const grantorMatch = cleaned.match(/(.*?)\s+conveyed/i);
  const granteeMatch = cleaned.match(/to\s+(.*?)(\.|,|$)/i);
  const issueMatch = cleaned.match(/issue[:\-\s]+(.*)/i);
  const tractMatch = cleaned.match(/tract\s+(\d+)/i);
  const interestMatch = cleaned.match(/(\d+\/\d+)(\s+)?(interest|mineral[s]?)/i);

  // Values
  const book = bookPageMatch ? bookPageMatch[1] : "[Book]";
  const page = bookPageMatch ? bookPageMatch[2] : "[Page]";

  const grantor = grantorMatch ? grantorMatch[1].trim() : "[Grantor]";
  const grantee = granteeMatch ? granteeMatch[1].trim() : "[Grantee]";

  const legal = legalMatch ? legalMatch[0].toUpperCase() : null;
  const tract = tractMatch ? `Tract ${tractMatch[1]}` : null;
  const section = legal || tract || "[Tract or Section]";

  const interest = interestMatch ? `an undivided ${interestMatch[1]} interest` : "an undivided interest";

  const issue = issueMatch ? issueMatch[1].trim() : "unclear conveyance language or formatting irregularities";

  // Date conversion
  let formattedDate = "[Date]";
  if (dateMatch) {
    const [_, m, d, y] = dateMatch;
    const year = y.length === 2 ? (parseInt(y) > 30 ? `19${y}` : `20${y}`) : y;
    const date = new Date(`${year}-${m}-${d}`);
    formattedDate = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  return `On ${formattedDate}, ${grantor} conveyed ${interest} to ${grantee} by instrument recorded in Book ${book}, Page ${page}, affecting ${section}. While the document appears to support the transfer, there is a noted issue: ${issue}. For the purposes of this report, the examiner has treated the conveyance as valid and attributed interest to ${grantee}.`;
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
