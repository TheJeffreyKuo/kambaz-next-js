export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />
      <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of
      </textarea>
      <br />
      <table>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-points">Points</label>
          </td>
          <td>
            <input id="wd-points" type="number" defaultValue={100} />
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-group">Assignment Group</label>
          </td>
          <td>
            <select id="wd-group">
                <option selected value="assignments">ASSIGNMENTS</option>
            </select>
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-display-grade-as">Display Grade as</label>
          </td>
          <td>
            <select id="wd-display-grade-as">
                <option selected value={"percentage"}>Percentage</option>
            </select>
          </td>
        </tr>
         <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-submission-type">Submission Type</label>
          </td>
          <td>
            <select id="wd-submission-type">
                <option selected value={"online"}>Online</option>
            </select>
            <table>
                <tr>
                    <td>
                        Online Entry Options
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="checkbox" name="check-text" id="wd-text-entry"/>
                        <label htmlFor="wd-text-entry">Text Entry</label><br/>
                        <input type="checkbox" name="check-website" id="wd-website-url"/>
                        <label htmlFor="wd-website-url">Website URL</label><br/>
                        <input type="checkbox" name="check-media" id="wd-media-recordings"/>
                        <label htmlFor="wd-media-recordings">Media Recordings</label><br/>
                        <input type="checkbox" name="check-annotation" id="wd-student-annotation"/>
                        <label htmlFor="wd-student-annotation">Student Annotation</label><br/>
                        <input type="checkbox" name="check-file" id="wd-file-upload"/>
                        <label htmlFor="wd-file-upload">File Uploads</label><br/>
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
                    <td><label htmlFor="wd-assign-to">Assign to</label></td>
                </tr>
                <tr>
                    <td>
                        <input id="wd-assign-to" defaultValue={"Everyone"} />
                    </td>
                </tr>
                <tr>
                    <td><label htmlFor="wd-due-date"> Due </label></td>
                </tr>
                <tr>
                    <td>
                        <input type="date"
                       value="2024-05-13"
                       id="wd-due-date"/><br/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label htmlFor="wd-available-from"> Available from </label>
                    </td>
                    <td>
                        <label htmlFor="wd-available-until"> Until </label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="date"
                       value="2024-05-06"
                       id="wd-available-from"/><br/>
                    </td>
                    <td>
                        <input type="date"
                       value="2024-05-20"
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
            <button type="button" id="wd-cancel">Cancel</button> <button type="button" id="wd-save">Save</button>
          </td>
        </tr>
      </table>
    </div>
);}
