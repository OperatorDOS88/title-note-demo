import { useState } from "react"
import { Textarea } from "./components/ui/textarea"
import { Button } from "./components/ui/button"
import { Card, CardContent } from "./components/ui/card"

// ------------------------
// 🔧 Title Note Generator Logic
// ------------------------
function generateTitleNote(input) {
  const deedMap = {
    QCD: "Quit Claim Deed",
    MD: "Mineral Deed",
    AOGL: "Assignment of Oil and Gas Leases",
    DTO: "Drilling Title Opinion",
    DOTO: "Division Order Title Opinion",
    WD: "Warranty Deed",
    GWD: "General Warranty Deed",
    QCMD: "Quit Claim Mineral Deed",
    FD: "Final Decree"
  };

  function formatDate(dateStr) {
    const [month, day, year] = dateStr.split('/');
    const fullYear = year.length === 2 ? (parseInt(year) < 25 ? '20' + year : '19' + year) : year;
    const dateObj = new Date(`${fullYear}-${month}-${day}`);
    return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  let output = "";
  const lines = input.trim().split('\n');

  lines.forEach(line => {
    const deedMatch = line.match(/(QCD|MD|AOGL|DTO|DOTO|WD|GWD|QCMD|FD)/);
    const bkpgMatch = line.match(/(\d{1,4})\s*[-\/\s]?\s*(\d{1,4})/);
    const dateMatch = line.match(/\b(\d{1,2}\/\d{1,2}\/\d{2,4})\b/);
    const termMatch = line.toLowerCase().includes('term');
    const prodMatch = line.toLowerCase().includes('no production');
    const expiredMatch = line.toLowerCase().includes('expired');

    if (deedMatch && bkpgMatch) {
      const deedFull = deedMap[deedMatch[1]] || "Instrument";
      const [_, book, page] = bkpgMatch;
      const formattedDate = dateMatch ? formatDate(dateMatch[1]) : "an unknown date";

      output += `${deedFull} recorded in Book ${book}, Page ${page}, dated ${formattedDate}, `;

      if (line.toLowerCase().includes("conveyed")) {
        output += `was used to convey interest. `;
      } else if (deedMatch[1] === "FD") {
        output += `was entered as a Final Decree. `;
      }
    }

    if (termMatch && expiredMatch) {
      output += `The interest was term-limited and is believed to have expired. `;
    }

    if (prodMatch) {
      output += `No production has occurred in the subject area. `;
    }
  });

  output += "\n\nFor the purposes of this report, the examiner has ";
  if (output.toLowerCase().includes("expired")) {
    output += "not credited any interest due to expiration of term interest.";
  } else {
    output += "credited the interest based on record instruments.";
  }

  return output.trim();
}

// ------------------------
// 🧠 Main App Component
// ------------------------
function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    const result = generateTitleNote(input);
    setOutput(result);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-4">
          <Textarea
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter field notes here..."
          />
          <Button className="mt-4" onClick={handleGenerate}>
            Generate Title Note
          </Button>
          <div className="mt-6 whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded">
            {output}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
