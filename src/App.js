import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function transformToTitleNote(input) {
  const cleaned = input.trim().replace(/\s+/g, " ")

  const bookPageMatch = cleaned.match(/(?:at\s*)?(\d{1,3})[\/\-](\d{1,3})/)
  const dateMatch = cleaned.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/)
  const interestMatch = cleaned.match(/conveyed\s+(.*?)\s+to/i)
  const grantorMatch = cleaned.match(/^(.*?)\s+conveyed/i)
  const granteeMatch = cleaned.match(/to\s+(.*?)\s+(at|on)/i)
  const issueMatch = cleaned.match(/(?:appears.*|unclear.*|issue[:\-\s]+.*)/i)
  const tractMatch = cleaned.match(/tract\s+(\d+)/i)

  const grantor = grantorMatch ? grantorMatch[1].trim() : "[Grantor]"
  const grantee = granteeMatch ? granteeMatch[1].trim() : "[Grantee]"
  const interest = interestMatch ? interestMatch[1].trim() : "an undivided interest"
  const book = bookPageMatch ? bookPageMatch[1] : "[Book]"
  const page = bookPageMatch ? bookPageMatch[2] : "[Page]"
  const tract = tractMatch ? `Tract ${tractMatch[1]}` : "[Tract or Section]"

  let formattedDate = "[Date]"
  if (dateMatch) {
    const [ , month, day, yearRaw ] = dateMatch
    const year = yearRaw.length === 2 ? `20${yearRaw}` : yearRaw
    const date = new Date(`${year}-${month}-${day}`)
    formattedDate = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const issue =
    issueMatch?.[0]?.replace(/(appears|issue|[:\-])/gi, "").trim() ||
    "unclear conveyance language or formatting irregularities"

  return `On ${formattedDate}, ${grantor} conveyed ${interest} to ${grantee} by instrument recorded in Book ${book}, Page ${page}, affecting ${tract}. While the document appears to support the transfer, there is a noted issue: ${issue}. For the purposes of this report, the examiner has treated the conveyance as valid and attributed interest to ${grantee}.`
}

export default function TitleNoteConverter() {
  const [fieldNote, setFieldNote] = useState("")
  const [outputNote, setOutputNote] = useState("")

  const generateTitleNote = () => {
    const note = transformToTitleNote(fieldNote)
    setOutputNote(note)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Title Note Generator (Demo)</h1>
      <Textarea
        className="w-full min-h-[120px] mb-4"
        placeholder="Paste unstructured field note here..."
        value={fieldNote}
        onChange={(e) => setFieldNote(e.target.value)}
      />
      <Button onClick={generateTitleNote}>Generate Title Note</Button>
      {outputNote && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Structured Title Note:</h2>
            <p>{outputNote}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
