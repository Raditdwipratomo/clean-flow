# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# CleanFlow — Water Infrastructure & Sanitation Reporting Platform

**Product Name:** CleanFlow  
**Product Type:** Web-Based Application  
**Category:** Environmental & Public Infrastructure Management  
**SDGs Alignment:** SDG 6 — Clean Water and Sanitation  
**Document Version:** 1.0  
**Status:** Development Ready

---

# 1. Product Overview

## 1.1 Product Description

CleanFlow is a web-based platform designed to facilitate community participation in reporting, monitoring, and resolving problems related to clean water infrastructure and sanitation facilities.

The platform connects three primary stakeholders:

1. **Citizen:** Community members who report water and sanitation problems.
2. **Field Officer:** Personnel responsible for inspecting and resolving reported problems.
3. **Administrator:** Personnel responsible for managing reports, verifying submissions, assigning field officers, and monitoring resolution progress.

CleanFlow aims to establish a transparent, structured, and accountable reporting workflow, ensuring that submitted reports are properly verified, assigned, handled, and resolved.

## 1.2 Problem Statement

Several problems related to clean water infrastructure and sanitation require better coordination between communities and responsible authorities.

Identified problems include:

- Broken or leaking water distribution pipes.
- Disrupted clean water distribution.
- Suspected contaminated or discolored water.
- Damaged public sanitation facilities.
- Blocked wastewater drainage systems.
- Inadequate monitoring of infrastructure maintenance.
- Lack of transparency regarding complaint handling.
- Difficulty tracking the progress of submitted reports.

Without an integrated reporting system, complaints may be difficult to track, duplicate reports may occur, and the resolution process may lack transparency.

## 1.3 Proposed Solution

CleanFlow provides a centralized reporting and monitoring platform with the following capabilities:

- Digital infrastructure and sanitation reporting.
- Location-based incident reporting.
- Photo evidence submission.
- Report verification and prioritization.
- Field officer assignment.
- Maintenance and inspection tracking.
- Resolution evidence management.
- Citizen confirmation.
- Administrative monitoring and analytics.

## 1.4 Product Vision

To become a community-driven digital platform that improves the management of clean water infrastructure and sanitation through transparent reporting, efficient coordination, and accountable problem resolution.

---

# 2. Goals and Objectives

## 2.1 Primary Goals

1. Simplify the process of reporting water infrastructure and sanitation problems.
2. Improve communication between citizens, administrators, and field officers.
3. Provide transparent report status tracking.
4. Improve the efficiency of maintenance assignment and execution.
5. Maintain historical records of infrastructure problems and their resolutions.
6. Support community participation in achieving SDG 6.

## 2.2 Success Metrics

| Metric | Measurement |
|---|---|
| Report Submission | Number of successfully submitted reports |
| Verification Rate | Percentage of reports successfully verified |
| Resolution Rate | Percentage of verified reports resolved |
| Average Resolution Time | Average time required to resolve reports |
| Assignment Rate | Percentage of verified reports assigned to officers |
| Citizen Satisfaction | Average rating after resolution |
| Reopened Report Rate | Percentage of reports reopened after resolution |

These metrics are intended for operational monitoring, not as claims that CleanFlow directly guarantees improved water quality.

---

# 3. Target Users and User Roles

CleanFlow consists of three primary user roles.

## 3.1 Citizen

**Description:** Registered community members who use the platform to report problems related to water infrastructure and sanitation.

**Permissions:**
- Register and log in.
- Manage personal profiles.
- Submit new reports.
- Upload photo evidence.
- Provide incident locations.
- View personal reports.
- Track report status.
- View report history.
- Receive notifications.
- Respond to requests for additional information.
- Confirm report resolution.
- Request reinspection.
- Submit feedback and ratings.

**Restrictions:**
- Cannot verify or approve reports.
- Cannot assign field officers.
- Cannot modify reports after verification, except through permitted additional information.
- Cannot access other users' private report information.

## 3.2 Field Officer

**Description:** Personnel responsible for inspecting, maintaining, and resolving infrastructure problems.

**Permissions:**
- Log in to the officer dashboard.
- View assigned reports.
- Accept or decline assignments.
- View report details and locations.
- Update inspection results.
- Upload inspection evidence.
- Update maintenance progress.
- Submit resolution documentation.
- Request reassignment when necessary.
- View assigned task history.

**Restrictions:**
- Cannot verify citizen submissions.
- Cannot assign tasks to other officers.
- Cannot permanently delete reports.
- Cannot close reports independently.
- Cannot modify reports outside their assignments.

## 3.3 Administrator

**Description:** Personnel responsible for managing the overall reporting and maintenance workflow.

**Permissions:**
- Access the administrative dashboard.
- View all reports.
- Verify submitted reports.
- Request additional information.
- Reject invalid reports.
- Identify duplicate reports.
- Set report priorities.
- Assign and reassign field officers.
- Monitor task progress.
- Review inspection documentation.
- Validate resolution evidence.
- Manage users and field officers.
- Manage report categories.
- View analytics and reports.
- Access activity logs.

**Restrictions:**
- Must provide reasons when rejecting reports.
- Must provide reasons when changing assignments or report priorities.
- Cannot modify historical activity logs.

---

# 4. Functional Requirements

# 4.1 Authentication and User Management

### FR-001: User Registration

The system must allow citizens to create an account.

Required fields:
- Full name.
- Email address.
- Phone number.
- Password.
- Password confirmation.

Requirements:
- Email addresses must be unique.
- Passwords must meet security requirements.
- Password confirmation must match.
- Registration must be validated before account creation.
- The system should support email verification.

### FR-002: User Login

The system must authenticate users using their registered credentials.

Requirements:
- Email and password authentication.
- Role-based dashboard redirection.
- Secure session management.
- Invalid credentials must return an appropriate error.
- Users must be able to log out.

### FR-003: Profile Management

Users must be able to view and update their personal information.

Citizen profile:
- Full name.
- Email.
- Phone number.
- Profile picture.
- Address.

Field Officer profile:
- Full name.
- Employee identification number.
- Phone number.
- Assigned service area.
- Specialization.
- Availability status.

Administrator profile:
- Full name.
- Email.
- Administrative role.

### FR-004: Role-Based Access Control

The system must enforce permissions based on authenticated user roles.

A user must not be able to access unauthorized resources by manipulating URLs or API requests.

---

# 4.2 Citizen Features

## FR-005: Citizen Dashboard

The citizen dashboard must display a summary of the user's reporting activity.

Dashboard components:
- Total submitted reports.
- Reports awaiting verification.
- Reports currently being processed.
- Resolved reports.
- Recent report activity.
- Quick action to create a report.

## FR-006: Create Report

Citizens must be able to submit infrastructure and sanitation reports.

Required form fields:

| Field | Type | Required |
|---|---|---|
| Report Title | Text | Yes |
| Category | Selection | Yes |
| Description | Textarea | Yes |
| Incident Location | GPS / Map Picker | Yes |
| Photo Evidence | Image Upload | Yes |
| Incident Date | Date | Yes |
| Impact Level | Selection | Yes |

Available categories:

1. Water Pipe Leakage.
2. Water Supply Disruption.
3. Suspected Water Contamination.
4. Damaged Sanitation Facility.
5. Wastewater Drainage Problem.
6. Other Water and Sanitation Issues.

Impact levels:
- Low.
- Medium.
- High.
- Critical.

The selected impact level is an initial citizen assessment. The administrator determines the official priority after verification.

**System behavior:**

1. Citizen completes the report form.
2. System validates required information.
3. System validates image file format and size.
4. System records the incident location.
5. System generates a unique report number.
6. System stores the report.
7. Report status becomes `SUBMITTED`.
8. Citizen receives a submission confirmation.

Example report number:

`CF-2026-000125`

## FR-007: My Reports

Citizens must be able to view their submitted reports.

Displayed information:
- Report ID.
- Report title.
- Category.
- Submission date.
- Incident location.
- Current priority.
- Current status.

Available filters:
- All reports.
- Submitted.
- Under verification.
- In progress.
- Resolved.
- Closed.
- Rejected.

Citizens must only access reports they own.

## FR-008: Report Detail and Tracking

The report detail page must display:

- Report information.
- Photo evidence.
- Incident location.
- Report priority.
- Current status.
- Assigned handling progress.
- Administrator notes intended for citizens.
- Officer inspection notes intended for citizens.
- Resolution evidence.
- Status history.

The system must provide a chronological activity timeline.

Example:

1. Report submitted.
2. Report verified.
3. Field officer assigned.
4. Inspection started.
5. Repair in progress.
6. Resolution submitted.
7. Waiting for citizen confirmation.

## FR-009: Additional Information

When an administrator requests additional information, the citizen must receive a notification.

The citizen can:
- View the requested information.
- Add clarification.
- Upload additional evidence.
- Resubmit the report for verification.

The report returns to the verification process after the required information is submitted.

## FR-010: Resolution Confirmation

When a report has passed administrative resolution validation, the citizen receives a notification.

Available actions:

**A. Problem Solved**
- Citizen confirms the problem has been resolved.
- System records the confirmation.
- Report status changes to `CLOSED`.

**B. Still Occurring**
- Citizen indicates the problem remains unresolved.
- Citizen provides an explanation.
- Citizen may upload additional evidence.
- Report is returned for reinspection.

If the citizen does not respond within the configured confirmation period, the report remains in `AWAITING_CONFIRMATION` until administrative follow-up. It must not be automatically marked as citizen-confirmed.

## FR-011: Feedback and Rating

After a report is closed, citizens may provide feedback.

Fields:
- Rating: 1–5 stars.
- Feedback comment.
- Optional additional remarks.

Only one feedback submission is allowed per closed report, with edits permitted according to administrative policy.

---

# 4.3 Administrator Features

## FR-012: Administrator Dashboard

The administrator dashboard must provide an overview of all reporting activities.

Dashboard statistics:
- Total reports.
- New submissions.
- Reports awaiting verification.
- Verified reports.
- Reports in progress.
- Reports awaiting confirmation.
- Closed reports.
- Rejected reports.

Additional components:
- Recent submissions.
- Reports by category.
- Reports by priority.
- Reports by status.
- Reports by geographical area.
- Average resolution time.
- Field officer workload.

## FR-013: Report Management

Administrators must be able to view and manage all submitted reports.

Available actions:
- View report details.
- Verify reports.
- Request additional information.
- Reject invalid reports.
- Mark duplicate reports.
- Change report priority.
- Assign field officers.
- Monitor resolution progress.

## FR-014: Report Verification

Administrators must verify reports before they are assigned.

Verification checklist:
- Report information is complete.
- Incident location is valid.
- Photo evidence is relevant.
- Category is appropriate.
- Report falls within the organization's service scope.
- Report is not an existing duplicate.

Available verification outcomes:

| Outcome | Description |
|---|---|
| VERIFIED | Report is valid |
| NEEDS_INFORMATION | Additional information is required |
| REJECTED | Report is invalid or outside service scope |
| DUPLICATE | Report duplicates an existing case |

All rejection and duplicate decisions must include an explanation.

For duplicate reports, administrators must be able to reference the primary report.

## FR-015: Priority Management

Administrators must determine the official report priority.

Priority levels:

| Priority | Description |
|---|---|
| CRITICAL | Major disruption affecting multiple households or posing an urgent safety risk |
| HIGH | Significant infrastructure disruption affecting a community |
| MEDIUM | Localized infrastructure or sanitation problems |
| LOW | Minor problems requiring non-urgent maintenance |

Priority must be adjustable by administrators with a recorded reason.

## FR-016: Field Officer Management

Administrators must be able to:
- Create field officer accounts.
- View officer profiles.
- Edit officer information.
- Set officer availability.
- Assign service areas.
- View assigned tasks.
- Monitor task completion.
- Deactivate accounts.

## FR-017: Task Assignment

Administrators must assign verified reports to field officers.

Assignment considerations:
- Service area.
- Officer specialization.
- Officer availability.
- Current workload.
- Report priority.

Each report can have only one active primary assignment at a time.

Assignment information:
- Report ID.
- Officer ID.
- Assigned date.
- Assignment notes.
- Assignment status.

If an officer declines an assignment, the report returns to the administrator's assignment queue.

## FR-018: Resolution Validation

Administrators must validate the resolution submitted by field officers.

Validation checklist:
- Inspection documentation exists.
- Repair actions are documented.
- Before-and-after evidence is provided where applicable.
- Resolution notes are complete.
- Report status is correctly updated.

Possible outcomes:

**Approved**
- Report moves to `AWAITING_CONFIRMATION`.
- Citizen receives a notification.

**Needs Revision**
- Resolution documentation is returned to the field officer.
- Officer must provide additional evidence or continue the work.

---

# 4.4 Field Officer Features

## FR-019: Field Officer Dashboard

The field officer dashboard must display:

- Assigned tasks.
- Pending assignments.
- Accepted tasks.
- Tasks currently in progress.
- Tasks awaiting administrative review.
- Completed tasks.
- Task priority distribution.

## FR-020: Assignment Management

Field officers must be able to view and respond to assignments.

Available actions:
- Accept assignment.
- Decline assignment.
- View assignment details.
- View incident location.
- Open external map navigation.

Declined assignments require a reason.

## FR-021: Site Inspection

After accepting an assignment, the officer must perform an inspection.

Required information:
- Inspection date and time.
- Inspection findings.
- Actual problem condition.
- Damage severity.
- Required maintenance actions.
- Inspection photographs.

The officer must be able to update the inspection status.

## FR-022: Maintenance Progress

Field officers must be able to update maintenance progress.

Available progress stages:
- Assigned.
- Accepted.
- Inspection in Progress.
- Repair in Progress.
- Resolution Submitted.

The officer must provide progress notes when appropriate.

## FR-023: Submit Resolution

When maintenance work is completed, the officer must submit a resolution report.

Required information:
- Actions performed.
- Resolution description.
- Completion date.
- After-repair evidence.
- Additional notes.

The officer then submits the resolution for administrator validation.

The officer cannot directly close the citizen's report.

---

# 4.5 Notification System

## FR-024: In-App Notifications

The system must generate notifications for important workflow events.

| Event | Recipient |
|---|---|
| Report successfully submitted | Citizen |
| Report verified | Citizen |
| Additional information requested | Citizen |
| Report rejected | Citizen |
| Field officer assigned | Field Officer |
| Assignment declined | Administrator |
| Inspection started | Citizen, Administrator |
| Repair progress updated | Citizen, Administrator |
| Resolution submitted | Administrator |
| Resolution approved | Citizen, Field Officer |
| Reinspection requested | Administrator, Field Officer |
| Report closed | Citizen, Administrator |

Notifications must contain:
- Notification title.
- Notification message.
- Related report ID.
- Creation timestamp.
- Read/unread status.

For the MVP, in-app notifications are mandatory. Email or push notifications can be implemented as additional capabilities.

---

# 4.6 Reporting and Analytics

## FR-025: Administrative Analytics

Administrators must be able to monitor reporting performance.

Analytics components:

1. Total report submissions.
2. Reports grouped by category.
3. Reports grouped by priority.
4. Reports grouped by status.
5. Reports grouped by geographical area.
6. Average resolution duration.
7. Resolution success rate.
8. Officer workload.

The dashboard must support date-range filtering.

## FR-026: Report Export

Administrators should be able to export report data in CSV format.

Exportable information:
- Report ID.
- Title.
- Category.
- Location.
- Priority.
- Submission date.
- Verification date.
- Resolution date.
- Current status.

Sensitive citizen information must not be exposed in unrestricted exports.

---

# 5. Business Process and Workflow

## 5.1 Main Business Workflow

CleanFlow follows this operational workflow:

**Report Submission → Verification → Assignment → Inspection → Maintenance → Resolution Validation → Citizen Confirmation → Closure**

### Step 1: Report Submission

Actor: Citizen

1. Citizen logs in.
2. Citizen opens the report submission page.
3. Citizen selects a report category.
4. Citizen enters the problem description.
5. Citizen selects an incident location.
6. Citizen uploads supporting evidence.
7. Citizen submits the report.
8. System generates a unique report ID.
9. System sets the report status to `SUBMITTED`.

### Step 2: Report Verification

Actor: Administrator

1. Administrator opens the submitted reports queue.
2. Administrator reviews the report.
3. Administrator checks the location and evidence.
4. Administrator checks for duplicate reports.
5. Administrator determines the verification outcome.

Decision:

- If valid: `VERIFIED`.
- If information is incomplete: `NEEDS_INFORMATION`.
- If invalid: `REJECTED`.
- If duplicate: `DUPLICATE`.

### Step 3: Priority Determination

Actor: Administrator

1. Administrator evaluates the incident impact.
2. Administrator selects the official priority.
3. System records the priority and its justification.
4. Verified report enters the assignment queue.

### Step 4: Field Officer Assignment

Actor: Administrator

1. Administrator selects an available officer.
2. System creates an assignment.
3. Officer receives a notification.
4. Officer accepts or declines the assignment.

If declined:
- System records the reason.
- Assignment becomes declined.
- Administrator receives a notification.
- Administrator selects another officer.

If accepted:
- Report status changes to `ASSIGNED`.

### Step 5: Site Inspection

Actor: Field Officer

1. Officer opens the assigned task.
2. Officer reviews report information.
3. Officer visits the incident location.
4. Officer records inspection findings.
5. Officer uploads inspection photographs.
6. Officer updates the report to `INSPECTION_IN_PROGRESS`.

### Step 6: Maintenance Execution

Actor: Field Officer

1. Officer determines the required maintenance actions.
2. Officer performs the repair or maintenance work.
3. Officer records progress updates.
4. Officer uploads supporting photographs.
5. Officer marks the work as completed.
6. Officer submits the resolution documentation.

Report status becomes `RESOLUTION_SUBMITTED`.

If the problem requires an external authority:
- Officer records the escalation reason.
- Administrator reviews the case.
- Administrator may transfer responsibility or coordinate with the relevant institution.
- The report remains tracked until an authorized resolution is documented.

### Step 7: Resolution Validation

Actor: Administrator

1. Administrator reviews the officer's resolution report.
2. Administrator checks supporting evidence.
3. Administrator decides whether the resolution is valid.

If rejected:
- Resolution status becomes `NEEDS_REVISION`.
- Officer receives feedback.
- Officer must revise the resolution or continue maintenance.

If approved:
- Report status becomes `AWAITING_CONFIRMATION`.
- Citizen receives a notification.

### Step 8: Citizen Confirmation

Actor: Citizen

The citizen reviews the resolution.

If the problem is resolved:
- Citizen selects `PROBLEM_SOLVED`.
- System records confirmation.
- Report status becomes `CLOSED`.

If the problem still exists:
- Citizen selects `STILL_OCCURRING`.
- Citizen submits an explanation and optional evidence.
- Report status returns to `REINSPECTION_REQUESTED`.
- Administrator reviews the request and arranges follow-up.

### Step 9: Report Closure

Actor: System

After confirmation:
- Report is marked as closed.
- Final resolution information is stored.
- Report history remains accessible.
- Citizen may provide a rating and feedback.

---

# 6. Report Status Lifecycle

The report status must follow a controlled lifecycle.

| Status | Description |
|---|---|
| SUBMITTED | Citizen successfully submits a report |
| NEEDS_INFORMATION | Administrator requests additional information |
| REJECTED | Report is rejected |
| DUPLICATE | Report is identified as a duplicate |
| VERIFIED | Report passes verification |
| ASSIGNED | A field officer is assigned |
| INSPECTION_IN_PROGRESS | Officer is inspecting the problem |
| REPAIR_IN_PROGRESS | Maintenance is being performed |
| RESOLUTION_SUBMITTED | Officer submits resolution documentation |
| NEEDS_REVISION | Administrator requests resolution revisions |
| AWAITING_CONFIRMATION | Resolution is approved and awaits citizen confirmation |
| REINSPECTION_REQUESTED | Citizen reports that the problem remains |
| CLOSED | Report is successfully closed |

### 6.1 Status Transition Rules

- `SUBMITTED` → `NEEDS_INFORMATION`, `REJECTED`, `DUPLICATE`, or `VERIFIED`.
- `NEEDS_INFORMATION` → `SUBMITTED` after additional information is provided.
- `VERIFIED` → `ASSIGNED`.
- `ASSIGNED` → `VERIFIED` if assignment is declined and no replacement has been assigned.
- `ASSIGNED` → `INSPECTION_IN_PROGRESS`.
- `INSPECTION_IN_PROGRESS` → `REPAIR_IN_PROGRESS` or `RESOLUTION_SUBMITTED` if no repair is necessary.
- `REPAIR_IN_PROGRESS` → `RESOLUTION_SUBMITTED`.
- `RESOLUTION_SUBMITTED` → `NEEDS_REVISION` or `AWAITING_CONFIRMATION`.
- `NEEDS_REVISION` → `REPAIR_IN_PROGRESS` or `RESOLUTION_SUBMITTED`.
- `AWAITING_CONFIRMATION` → `CLOSED` or `REINSPECTION_REQUESTED`.
- `REINSPECTION_REQUESTED` → `ASSIGNED` after administrative review and reassignment.

Every status transition must be recorded in the report activity history.

---

# 7. Business Rules

| ID | Business Rule |
|---|---|
| BR-001 | Only authenticated citizens can submit reports. |
| BR-002 | Every report must have a unique report number. |
| BR-003 | Every report must include a category, description, location, incident date, and photo evidence. |
| BR-004 | A report must be verified before officer assignment. |
| BR-005 | Administrators are responsible for official report prioritization. |
| BR-006 | Only administrators can assign or reassign officers. |
| BR-007 | One report can have only one active primary assignment. |
| BR-008 | Officers can only update reports assigned to them. |
| BR-009 | Officers must provide inspection documentation. |
| BR-010 | Resolution submissions must include supporting evidence. |
| BR-011 | Administrators must validate resolutions before citizen confirmation. |
| BR-012 | Reports can only be closed after citizen confirmation or an explicitly authorized administrative closure policy. |
| BR-013 | Citizens can only access their own private reports. |
| BR-014 | Rejected reports must include a rejection reason. |
| BR-015 | Assignment declines must include a reason. |
| BR-016 | All important status changes must be logged. |
| BR-017 | Duplicate reports must reference a primary report. |
| BR-018 | Reports must remain available as historical records after closure. |

---

# 8. Application Pages and Navigation

## 8.1 Public Pages

- Landing Page.
- About CleanFlow.
- SDG 6 Information.
- Login.
- Register.

## 8.2 Citizen Pages

- Citizen Dashboard.
- Create Report.
- My Reports.
- Report Detail.
- Report Tracking.
- Notifications.
- Profile Settings.
- Feedback Form.

## 8.3 Administrator Pages

- Admin Dashboard.
- Report Management.
- Report Verification.
- Report Detail.
- Officer Management.
- Assignment Management.
- Resolution Validation.
- Analytics Dashboard.
- Category Management.
- User Management.
- Notification Center.
- Activity Logs.
- Profile Settings.

## 8.4 Field Officer Pages

- Officer Dashboard.
- Assignment List.
- Assignment Detail.
- Inspection Form.
- Maintenance Progress.
- Resolution Submission.
- Task History.
- Notifications.
- Profile Settings.

---

# 9. Data Requirements and Database Design

The following entities are recommended for the initial database implementation.

## 9.1 Users

Stores authentication and account information.

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name | VARCHAR | Full name |
| email | VARCHAR | Unique email |
| phone | VARCHAR | Phone number |
| password | VARCHAR | Hashed password |
| role | ENUM | CITIZEN, OFFICER, ADMIN |
| avatar | VARCHAR | Profile image URL |
| is_active | BOOLEAN | Account status |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |

## 9.2 Officer Profiles

Stores additional information for field officers.

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | Reference to users |
| employee_number | VARCHAR | Employee identification |
| service_area | VARCHAR | Assigned service area |
| specialization | VARCHAR | Officer specialization |
| availability | ENUM | AVAILABLE, BUSY, INACTIVE |

## 9.3 Reports

Stores all citizen submissions.

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| report_number | VARCHAR | Unique report identifier |
| citizen_id | UUID | Report creator |
| category_id | UUID | Report category |
| title | VARCHAR | Report title |
| description | TEXT | Problem description |
| latitude | DECIMAL | Incident latitude |
| longitude | DECIMAL | Incident longitude |
| address | TEXT | Incident address |
| incident_date | DATE | Incident date |
| impact_level | ENUM | LOW, MEDIUM, HIGH, CRITICAL |
| priority | ENUM | LOW, MEDIUM, HIGH, CRITICAL |
| status | ENUM | Current report status |
| duplicate_of | UUID | Primary report reference |
| created_at | TIMESTAMP | Submission date |
| updated_at | TIMESTAMP | Last update |

## 9.4 Report Categories

Stores available reporting categories.

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name | VARCHAR | Category name |
| description | TEXT | Category description |
| is_active | BOOLEAN | Category availability |

## 9.5 Report Attachments

Stores report and resolution evidence metadata.

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| report_id | UUID | Related report |
| uploaded_by | UUID | User who uploaded |
| file_url | VARCHAR | Storage location |
| file_type | ENUM | IMAGE, DOCUMENT |
| attachment_type | ENUM | CITIZEN_EVIDENCE, INSPECTION, RESOLUTION |
| created_at | TIMESTAMP | Upload date |

## 9.6 Assignments

Stores officer assignment information.

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| report_id | UUID | Related report |
| officer_id | UUID | Assigned officer |
| assigned_by | UUID | Administrator |
| status | ENUM | PENDING, ACCEPTED, DECLINED, CANCELLED |
| assigned_at | TIMESTAMP | Assignment date |
| responded_at | TIMESTAMP | Response date |
| decline_reason | TEXT | Reason for decline |

## 9.7 Inspections

Stores field inspection records.

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| report_id | UUID | Related report |
| officer_id | UUID | Inspecting officer |
| findings | TEXT | Inspection results |
| damage_severity | ENUM | LOW, MEDIUM, HIGH, CRITICAL |
| maintenance_required | BOOLEAN | Whether repair is needed |
| inspected_at | TIMESTAMP | Inspection date |

## 9.8 Maintenance Updates

Stores maintenance progress.

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| report_id | UUID | Related report |
| officer_id | UUID | Responsible officer |
| description | TEXT | Maintenance activity |
| progress_status | ENUM | INSPECTION, REPAIR, COMPLETED |
| created_at | TIMESTAMP | Activity date |

## 9.9 Resolution Reviews

Stores administrative validation of resolution submissions.

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| report_id | UUID | Related report |
| reviewed_by | UUID | Administrator |
| decision | ENUM | APPROVED, NEEDS_REVISION |
| remarks | TEXT | Review comments |
| reviewed_at | TIMESTAMP | Review date |

## 9.10 Report Status History

Stores all report lifecycle changes.

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| report_id | UUID | Related report |
| changed_by | UUID | Actor who changed status |
| previous_status | VARCHAR | Previous status |
| new_status | VARCHAR | New status |
| notes | TEXT | Change explanation |
| created_at | TIMESTAMP | Change date |

## 9.11 Notifications

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | Recipient |
| report_id | UUID | Related report |
| title | VARCHAR | Notification title |
| message | TEXT | Notification message |
| is_read | BOOLEAN | Read status |
| created_at | TIMESTAMP | Notification date |

## 9.12 Feedback

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| report_id | UUID | Related report |
| citizen_id | UUID | Feedback author |
| rating | INTEGER | Rating from 1–5 |
| comment | TEXT | Feedback comment |
| created_at | TIMESTAMP | Submission date |

**Database constraints:**
- All primary keys must use unique identifiers.
- Email addresses must have a unique constraint.
- Report numbers must have a unique constraint.
- Foreign keys must maintain referential integrity.
- Important historical records must not be physically deleted.
- Report status transitions must be validated by the backend.
- Only one active primary assignment is permitted per report.

---

# 10. Non-Functional Requirements

## 10.1 Security

- Passwords must be securely hashed using Argon2id or bcrypt.
- Authentication must use secure session or token management.
- All protected APIs must enforce authorization.
- Role permissions must be validated on the backend.
- File uploads must validate MIME type and file size.
- Uploaded files must not be publicly writable.
- Input validation and sanitization must prevent common injection attacks.
- APIs must implement rate limiting where appropriate.
- Sensitive user information must not be exposed to unauthorized users.

## 10.2 Performance

- Standard dashboard requests should target response times below 2 seconds under normal operating conditions.
- Paginated endpoints must be used for large report collections.
- Images should be optimized before display.
- Database queries should use appropriate indexes.
- File uploads should provide loading and error feedback.

## 10.3 Reliability

- Failed submissions must not create duplicate records.
- Important workflow updates must be persisted.
- The system must provide clear error messages.
- Database backups should be configured for production.
- Status updates and activity history must remain consistent.

## 10.4 Usability

- Responsive interface for desktop, tablet, and mobile.
- Clear status indicators.
- Simple report submission process.
- Accessible forms and readable typography.
- Consistent navigation across user roles.
- Clear feedback for successful and failed actions.

## 10.5 Privacy

- Citizens must not see private reports belonging to other citizens.
- Location and personal information must only be accessible to authorized parties.
- Public-facing report information must not expose private citizen details.
- Activity logs must be restricted to authorized administrators.

---

# 11. API Requirements

The backend should expose RESTful APIs.

Suggested endpoint structure:

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register citizen |
| POST | /api/auth/login | Authenticate user |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Current user |

## Citizen Reports

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/reports | Create report |
| GET | /api/reports/my | Get citizen reports |
| GET | /api/reports/:id | Get report detail |
| PATCH | /api/reports/:id/information | Submit additional information |
| POST | /api/reports/:id/confirmation | Confirm or request reinspection |
| POST | /api/reports/:id/feedback | Submit feedback |

## Administrator

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/admin/reports | Get all reports |
| PATCH | /api/admin/reports/:id/verify | Verify report |
| PATCH | /api/admin/reports/:id/reject | Reject report |
| PATCH | /api/admin/reports/:id/priority | Update priority |
| POST | /api/admin/reports/:id/assign | Assign officer |
| PATCH | /api/admin/resolutions/:id/review | Review resolution |
| GET | /api/admin/analytics | Get analytics |
| GET | /api/admin/officers | Get field officers |
| POST | /api/admin/officers | Create officer |
| PATCH | /api/admin/officers/:id | Update officer |

## Field Officer

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/officer/assignments | Get assigned tasks |
| PATCH | /api/officer/assignments/:id/respond | Accept or decline |
| POST | /api/officer/reports/:id/inspection | Submit inspection |
| POST | /api/officer/reports/:id/progress | Update maintenance progress |
| POST | /api/officer/reports/:id/resolution | Submit resolution |

## Notifications

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/notifications | Get user notifications |
| PATCH | /api/notifications/:id/read | Mark notification as read |
| PATCH | /api/notifications/read-all | Mark all as read |

All endpoints must implement authentication, validation, error handling, and role-based authorization where required.

---

# 12. Recommended Technology Stack

The following technology stack is recommended for implementation.

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Routing | React Router |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Backend | Node.js + Express.js |
| Database | MySQL |
| ORM | Prisma |
| Authentication | JWT or secure session-based authentication |
| Image Storage | Supabase Storage |
| Maps | Leaflet + OpenStreetMap |
| Form Validation | Zod + React Hook Form |
| Charts | Recharts |
| API Testing | Postman |
| Automated Testing | Vitest + Supertest |
| Version Control | Git + GitHub |

### Technology Considerations

**Maps and Location**
- Leaflet can render interactive maps.
- OpenStreetMap can provide map tiles.
- Browser geolocation can capture the citizen's current location.
- Citizens should also be able to select a location manually.

**Image Storage**
- Store image files in Supabase Storage.
- Store file URLs and metadata in MySQL.
- Restrict file access when images contain sensitive information.

**Testing**
- Vitest for frontend and backend unit tests.
- Supertest for API integration tests.
- Playwright can be added for end-to-end testing.

The technology stack can be adjusted according to project constraints.

---

# 13. MVP Scope and Development Priorities

The initial development should focus on implementing the core business workflow rather than introducing too many advanced features.

## 13.1 Must Have (MVP)

### Authentication
- Citizen registration and login.
- Admin login.
- Field officer login.
- Role-based authorization.

### Citizen
- Citizen dashboard.
- Create report.
- Upload evidence.
- Select incident location.
- My Reports.
- Report detail and tracking.
- Additional information submission.
- Resolution confirmation.
- Reinspection request.

### Administrator
- Admin dashboard.
- Report management.
- Report verification.
- Request additional information.
- Reject reports.
- Set priorities.
- Officer assignment.
- Resolution validation.
- Officer management.
- Basic analytics.

### Field Officer
- Officer dashboard.
- View assigned tasks.
- Accept or decline assignments.
- Submit inspection.
- Update maintenance progress.
- Upload resolution evidence.

### Shared
- In-app notifications.
- Report status history.
- Basic responsive design.
- Input validation.
- Backend authorization.
- Error handling.

## 13.2 Should Have

- Interactive map visualization.
- Report filtering by geographical area.
- CSV export.
- Advanced analytics.
- Email notifications.
- Officer workload visualization.
- Duplicate report detection assistance.
- Report search functionality.

## 13.3 Could Have

- AI-assisted report categorization.
- AI-assisted image analysis.
- Automatic assignment recommendations.
- Predictive maintenance insights.
- Public infrastructure problem map.
- Integration with external government reporting systems.

## 13.4 Out of Scope for MVP

The following capabilities are explicitly excluded from the first release:

- Direct IoT sensor integration.
- Automatic laboratory-grade water quality testing.
- Automatic repair scheduling using AI.
- Real-time tracking of field officer GPS.
- Payment processing.
- Government system integration.
- Native Android and iOS applications.
- Automated emergency response.

These features may be considered in future development phases.

---

# 14. UI/UX Requirements

The application should use a clean, modern, and trustworthy visual identity.

## 14.1 Design Direction

**Theme:** Clean Water, Environmental Sustainability, and Community Collaboration.

Recommended visual elements:
- Primary color: Blue.
- Secondary color: Teal.
- Background: White or light gray.
- Accent color: Green.
- Rounded cards and buttons.
- Clear icons and status badges.
- Interactive maps.
- Simple data visualizations.

## 14.2 User Experience Principles

1. Report submission should be simple and straightforward.
2. Report status must be easy to understand.
3. Important actions must be visually distinguishable.
4. Forms should provide clear validation messages.
5. Users should receive feedback after important actions.
6. Dashboards should prioritize relevant information for each role.
7. Interfaces must be responsive across common screen sizes.

---

# 15. Acceptance Criteria

The MVP is considered functionally complete when the following criteria are satisfied.

## Authentication
- [ ] Users can register and log in.
- [ ] Users are redirected to their respective dashboards.
- [ ] Unauthorized users cannot access protected pages.
- [ ] Backend endpoints enforce role permissions.

## Citizen
- [ ] Citizens can submit reports with valid information.
- [ ] Reports receive unique report numbers.
- [ ] Citizens can upload supporting evidence.
- [ ] Citizens can select incident locations.
- [ ] Citizens can view and track their own reports.
- [ ] Citizens receive status notifications.
- [ ] Citizens can provide resolution confirmation.
- [ ] Citizens can request reinspection.

## Administrator
- [ ] Administrators can view all reports.
- [ ] Administrators can verify and reject reports.
- [ ] Administrators can request additional information.
- [ ] Administrators can assign field officers.
- [ ] Administrators can set report priorities.
- [ ] Administrators can validate resolution evidence.
- [ ] Administrators can view basic analytics.

## Field Officer
- [ ] Officers can view assigned tasks.
- [ ] Officers can accept or decline assignments.
- [ ] Officers can submit inspection records.
- [ ] Officers can update maintenance progress.
- [ ] Officers can submit resolution documentation.

## System
- [ ] Every report status transition is recorded.
- [ ] Users receive relevant in-app notifications.
- [ ] Duplicate report numbers cannot be generated.
- [ ] Unauthorized data access is prevented.
- [ ] Forms validate required fields.
- [ ] Report workflows follow the defined business rules.
- [ ] Core API endpoints have automated tests.

---

# 16. Testing Requirements

The application should implement automated testing at multiple levels.

## 16.1 Unit Testing

Test individual functions and business logic.

Examples:
- Report number generation.
- Report form validation.
- Priority validation.
- Status transition validation.
- Role permission checks.

## 16.2 Integration Testing

Test interactions between backend components.

Examples:
- Citizen submits a report and the database stores it.
- Administrator verifies a report.
- Administrator assigns an officer.
- Officer submits inspection documentation.
- Administrator approves a resolution.
- Citizen closes the report.

## 16.3 End-to-End Testing

Test complete user workflows.

**Scenario 1: Successful Report Resolution**

1. Citizen logs in.
2. Citizen creates a report.
3. Administrator verifies the report.
4. Administrator assigns an officer.
5. Officer accepts the assignment.
6. Officer inspects the location.
7. Officer submits repair documentation.
8. Administrator approves the resolution.
9. Citizen confirms the resolution.
10. System closes the report.

Expected result: Report status is `CLOSED`.

**Scenario 2: Additional Information Required**

1. Citizen submits an incomplete report.
2. Administrator requests additional information.
3. Citizen receives a notification.
4. Citizen provides the missing information.
5. Administrator verifies the updated report.

Expected result: Report returns to the verification workflow.

**Scenario 3: Resolution Rejected**

1. Officer submits resolution documentation.
2. Administrator reviews the evidence.
3. Administrator requests revisions.
4. Officer receives the revision request.
5. Officer submits updated documentation.
6. Administrator approves the resolution.

Expected result: Report moves to `AWAITING_CONFIRMATION`.

**Scenario 4: Reinspection Requested**

1. Administrator approves a resolution.
2. Citizen receives a notification.
3. Citizen reports that the problem still exists.
4. Citizen submits additional evidence.
5. Administrator reviews the reinspection request.
6. Administrator reassigns the report.

Expected result: Report returns to the assignment workflow.

---

# 17. Development Roadmap

Recommended implementation phases:

| Phase | Scope | Priority |
|---|---|---|
| Phase 1 | Project setup, database, authentication, RBAC | Critical |
| Phase 2 | Citizen reporting and report management | Critical |
| Phase 3 | Admin verification and assignment | Critical |
| Phase 4 | Field officer inspection and maintenance | Critical |
| Phase 5 | Resolution validation and citizen confirmation | Critical |
| Phase 6 | Notifications and report history | High |
| Phase 7 | Dashboard analytics and maps | High |
| Phase 8 | Automated testing and optimization | Critical |

Development should follow the dependency order of the business workflow.

---

# 18. Future Development Opportunities

After the MVP is successfully implemented, CleanFlow can be expanded with the following capabilities.

### AI-Assisted Report Classification
AI can analyze report descriptions and suggest the appropriate reporting category.

### AI Image Analysis
Computer vision can assist in identifying visible infrastructure damage from submitted images. The result must be treated as an initial suggestion, not an official diagnosis.

### Intelligent Assignment Recommendation
The system can recommend field officers based on location, specialization, workload, and availability.

### Infrastructure Monitoring
IoT sensors can be integrated to monitor water pressure, flow rates, and selected water quality parameters.

### Public Transparency Dashboard
A public dashboard can display aggregated report statistics without revealing personal information.

### Predictive Maintenance
Historical maintenance records can be analyzed to identify infrastructure locations that may require preventive inspection.

---

# 19. SDG Impact and Sustainability

CleanFlow primarily supports **SDG 6 — Clean Water and Sanitation**.

Its contributions include:

| SDG Target | Expected Contribution |
|---|---|
| 6.1 | Supports reporting and follow-up of clean water distribution problems |
| 6.2 | Supports reporting and maintenance of sanitation facilities |
| 6.3 | Supports reporting of suspected pollution and wastewater problems |
| 6.b | Encourages community participation in water and sanitation management |

### Proposed Impact Indicators

- Number of water infrastructure problems reported.
- Number of sanitation problems reported.
- Number of verified reports.
- Percentage of reports resolved.
- Average time required for resolution.
- Number of citizens participating in reporting.
- Number of infrastructure problems successfully addressed.

CleanFlow does not independently guarantee access to safe drinking water or eliminate water pollution. Its contribution is to improve the reporting, coordination, monitoring, and accountability processes that support those broader objectives.

---

# 20. Final Product Summary

CleanFlow is a community-driven water infrastructure and sanitation reporting platform that connects citizens, field officers, and administrators through an integrated digital workflow.

Its primary value lies in transforming unstructured public complaints into traceable maintenance cases.

The application is built around five fundamental capabilities:

1. **Report:** Citizens report water and sanitation problems.
2. **Verify:** Administrators validate submissions.
3. **Assign:** Administrators assign verified cases to field officers.
4. **Resolve:** Field officers inspect and perform maintenance.
5. **Monitor:** Citizens and administrators track the resolution process.

The ultimate objective is to create a more transparent, responsive, and accountable infrastructure maintenance ecosystem while supporting the achievement of Sustainable Development Goal 6.

**Product Principle: Every valid report should have a clear owner, a traceable process, and a documented outcome.**