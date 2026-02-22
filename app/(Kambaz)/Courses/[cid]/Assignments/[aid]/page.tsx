import Link from "next/link";
import {
  Form,
  FormLabel,
  FormControl,
  FormSelect,
  FormCheck,
  Button,
} from "react-bootstrap";
import * as db from "../../../../../Database";

export default async function AssignmentEditor({
  params,
}: {
  params: Promise<{ cid: string; aid: string }>;
}) {
  const { cid, aid } = await params;
  const assignment = db.assignments.find((a) => a._id === aid && a.course === cid);

  return (
    <Form id="wd-assignments-editor">
      <FormLabel htmlFor="wd-name">Assignment Name</FormLabel>
      <FormControl id="wd-name" defaultValue={assignment?.title ?? "A1"} /><br /><br />
      <FormControl
        id="wd-description"
        as="textarea"
        rows={9}
        className="border"
        defaultValue={assignment?.description ?? ""}
      />
      <br />
      <table>
        <tbody>
          <tr>
            <td align="right" valign="top">
              <FormLabel htmlFor="wd-points">Points</FormLabel>
            </td>
            <td>
              <FormControl id="wd-points" type="number" defaultValue={assignment?.points ?? 100} />
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
              <FormSelect id="wd-display-grade-as" defaultValue="percentage">
                <option value="percentage">Percentage</option>
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
              <FormSelect id="wd-submission-type" defaultValue="online">
                <option value="online">Online</option>
                <option value="On Paper">On Paper</option>
                <option value="External Tool">External Tool</option>
                <option value="No Submission">No Submission</option>
              </FormSelect>
              <table>
                <tbody>
                  <tr><td><FormLabel className="fw-bold small">Online Entry Options</FormLabel></td></tr>
                  <tr>
                    <td>
                      <FormCheck type="checkbox" name="check-text" id="wd-text-entry" label="Text Entry" /><br />
                      <FormCheck type="checkbox" name="check-website" id="wd-website-url" label="Website URL" defaultChecked /><br />
                      <FormCheck type="checkbox" name="check-media" id="wd-media-recordings" label="Media Recordings" /><br />
                      <FormCheck type="checkbox" name="check-annotation" id="wd-student-annotation" label="Student Annotation" /><br />
                      <FormCheck type="checkbox" name="check-file" id="wd-file-upload" label="File Uploads" /><br />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">Assign</td>
            <td>
              <table>
                <tbody>
                  <tr><td><FormLabel htmlFor="wd-assign-to" className="fw-bold small">Assign to</FormLabel></td></tr>
                  <tr><td><FormControl id="wd-assign-to" defaultValue="Everyone" /></td></tr>
                  <tr><td><FormLabel htmlFor="wd-due-date" className="fw-bold small">Due</FormLabel></td></tr>
                  <tr>
                    <td>
                      <FormControl type="date" id="wd-due-date" defaultValue={assignment?.dueDate ?? "2024-05-13"} /><br />
                    </td>
                  </tr>
                  <tr>
                    <td><FormLabel htmlFor="wd-available-from" className="fw-bold small">Available from</FormLabel></td>
                    <td><FormLabel htmlFor="wd-available-until" className="fw-bold small">Until</FormLabel></td>
                  </tr>
                  <tr>
                    <td>
                      <FormControl type="date" id="wd-available-from" defaultValue={assignment?.availableDate ?? "2024-05-06"} /><br />
                    </td>
                    <td>
                      <FormControl type="date" id="wd-available-until" defaultValue="2024-05-20" /><br />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr><td colSpan={2}><hr /></td></tr>
          <tr>
            <td colSpan={2} align="right">
              <Link href={`/Courses/${cid}/Assignments`}>
                <Button type="button" id="wd-cancel">Cancel</Button>
              </Link>{" "}
              <Link href={`/Courses/${cid}/Assignments`}>
                <Button type="button" id="wd-save" variant="danger">Save</Button>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </Form>
  );
}
