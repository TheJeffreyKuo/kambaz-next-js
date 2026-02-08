import {
  Form,
  FormLabel,
  FormControl,
  FormSelect,
  FormCheck,
  Button,
} from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <Form id="wd-assignments-editor">
      <FormLabel htmlFor="wd-name">Assignment Name</FormLabel>
      <FormControl id="wd-name" defaultValue="A1" /><br /><br />
      <FormControl
            id="wd-description"
            as="textarea"
            rows={9}
            className="border"
            defaultValue={`The assignment is available online. 
Submit a link to the landing page of your Web application running on Netlify.

• Your full name and section
• Links to each of the lab assignments
• Link to the Kanbas application
• Links to all relevant source code repositories

The Kanbas application should include a link to navigate back to the landing page.`}
          />
      <br />
      <table>
        <tr>
          <td align="right" valign="top">
            <FormLabel htmlFor="wd-points">Points</FormLabel>
          </td>
          <td>
            <FormControl id="wd-points" type="number" defaultValue={100} />
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <FormLabel htmlFor="wd-group">Assignment Group</FormLabel>
          </td>
          <td>
            <FormSelect id="wd-group" defaultValue="assignments">
                <option value="assignments">ASSIGNMENTS</option>
                <option value="QUIZZES">QUIZZES</option>
                <option value="EXAMS">EXAMS</option>
                <option value="PROJECT">PROJECT</option>
            </FormSelect>
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <FormLabel htmlFor="wd-display-grade-as">Display Grade as</FormLabel>
          </td>
          <td>
            <FormSelect id="wd-display-grade-as" defaultValue={"percentage"}>
                <option value={"percentage"}>Percentage</option>
                <option value="Points">Points</option>
                <option value="Letter">Letter</option>
            </FormSelect>
          </td>
        </tr>
         <tr>
          <td align="right" valign="top">
            <FormLabel htmlFor="wd-submission-type">Submission Type</FormLabel>
          </td>
          <td>
            <FormSelect id="wd-submission-type" defaultValue={"online"}>
                <option value={"online"}>Online</option>
                <option value="On Paper">On Paper</option>
                <option value="External Tool">External Tool</option>
                <option value="No Submission">No Submission</option>
            </FormSelect>
            <table>
                <tr>
                    <td>
                        <FormLabel className="fw-bold small">Online Entry Options</FormLabel>
                    </td>
                </tr>
                <tr>
                    <td>
                        <FormCheck type="checkbox" name="check-text" id="wd-text-entry" label="Text Entry" /><br/>
                        <FormCheck type="checkbox" name="check-website" id="wd-website-url" label="Website URL" defaultChecked/><br/>
                        <FormCheck type="checkbox" name="check-media" id="wd-media-recordings" label="Media Recordings" /><br/>
                        <FormCheck type="checkbox" name="check-annotation" id="wd-student-annotation" label="Student Annotation" /><br/>
                        <FormCheck type="checkbox" name="check-file" id="wd-file-upload" label="File Uploads" /><br/>
                    </td>
                </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            Assign
          </td>
          <td>
            <table>
                <tr>
                    <td><FormLabel htmlFor="wd-assign-to" className="fw-bold small">Assign to</FormLabel></td>
                </tr>
                <tr>
                    <td>
                        <FormControl id="wd-assign-to" defaultValue={"Everyone"} />
                    </td>
                </tr>
                <tr>
                    <td><FormLabel htmlFor="wd-due-date" className="fw-bold small"> Due </FormLabel></td>
                </tr>
                <tr>
                    <td>
                      <FormControl type="date"
                       defaultValue="2024-05-13"
                       id="wd-due-date"/><br/>
                    </td>
                </tr>
                <tr>
                    <td>
                      <FormLabel htmlFor="wd-available-from" className="fw-bold small"> Available from </FormLabel>
                    </td>
                    <td>
                      <FormLabel htmlFor="wd-available-until" className="fw-bold small"> Until </FormLabel>
                    </td>
                </tr>
                <tr>
                    <td>
                      <FormControl type="date"
                       defaultValue="2024-05-06"
                       id="wd-available-from"/><br/>
                    </td>
                    <td>
                      <FormControl type="date"
                       defaultValue="2024-05-20"
                       id="wd-available-until"/><br/>
                    </td>
                </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td colSpan={2}><hr /></td>
        </tr>
        <tr>
          <td colSpan={2} align="right">
            <Button type="button" id="wd-cancel">Cancel</Button> <Button type="button" id="wd-save">Save</Button>
          </td>
        </tr>
      </table>
    </Form>
);}
