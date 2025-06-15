from typing import Dict, Any, List
import json

# Leave Policy
LEAVE_POLICY = """Annex-'A' Employee Benefit Policy 2021
Leave Policy
HOLIDAYS: Company will declare the number of public holidays at the beginning of the year.
General procedure for applying the leaves and its sanction will be as under:
W.e.f January 2021, the benefit of all the kinds of leave is given on monthly basis.
The employee will keep earning the leave as per requirements detailed in following paragraphs, but will
be entitled to avail/utilize leave as per their joining date.
Any type of leave including leave without pay needs the prior sanction of the reporting authority.
Employee has to apply for leave through the HR tool, as soon as they intend to avail any type of
leave, or 15 days before the date of leave. This advance notice of leave may be relaxed in case of
very deserving/emergency situations. In case of emergency leaves employee is required to apply
for the same within 1 day of resuming the duties.
Any leave that is unplanned/unapplied or unsanctioned (due to office exigencies) may be treated
as LWP (irrespective of availability of leave balance with the employee)
It is desired that employee's absenteeism from the work may be to the extent of leave entitled.
Absenteeism or leave without pay for whatsoever reason it may be, will be treated as an adverse impact
on the service record of the employee and will impact his/her future performance appraisals and incentive
entitlement (if any).
General rules for availing different types of Leaves and their sanction will be as under:
Earned Leave: -
Can be used for any purpose.
EL/s will be credited on the last day of every month.
An employee will earn following number of leaves for the following year slabs of active service,
calculated from the date of joining:-
First year with WG = 4.5 EL upon completing 3 months and 1.5 every month
thereafter
1-3 years with WG = 18 leaves per year, 1.5 ELs every month
3+ years with WG = 24 leaves per year, 2 ELs every month
Els can be clubbed with Compensatory offs.
Leave count in any month/s exceeding the leave balance at the given point will be treated as
LWP.
While calculating ELs, any leave (Saturdays, Sundays and public holidays) falling in between will
not be counted as leave/s.
Upon availing a half day leave before/after, any Saturdays, Sundays and Public holidays, will not
be counted as leave/s.
Half day leave will be permissible.
Any balance of unused leave may be carried forward to next calendar year subject to a
maximum accumulation of 45 days.
Earned Leaves not used by the end of the year can be en-cashed up to 15 days only.
Compensatory off:
If a team member is required to work on any important assignment on a Public Holiday/ Sunday
and Saturday, he is eligible for Compensatory off on any other working day.
One comp off would be credited to the member's account for working on both Saturday and
Sunday, respectively. No Comp off would be credited for working on either of the days.
A person will be eligible for full day compensatory leave if he/she has worked for 8 hours and half
day compensatory leave if he/she has worked up to 4.5 hours.
Official approval is required from the reporting authority/management to work on such Public
Holiday/Sunday. No compensatory offs will be entertained when worked on these days without
proper approval.
The compensatory off must be availed within a period of 60 days from the date worked.
Compensatory off when not availed within the stipulated time period will lapse.
It cannot be availed in halves, in case of full day working.
Can be clubbed with EL.
It can neither be en-cashed nor carried forward.
Members working on Occasional Saturdays for any work exigencies are not eligible for
compensatory off.
Encashment of Earned Leave:
To facilitate those employees who do not wish accumulation/since accumulation of earned leave
beyond 45 days is not allowed, there will be a provision for encashment of thest earned leave. Such
leave can be encashed, once in a year, as per the leave balance as on 31 December of that
particular year.
Maximum ELs that can be encashed : 15
Entitlement for such encashment will begin after completion of one year in service.
EL Encashment amount would be credited to your account in First Quarter of every year.
Upto 10 ELs can be encashed upon exit from the organisation.
Work from Home:
Maximum WFH is 12/calendar year. (This can only be increased at the discretion of HR).
All team members holding position of Lead and above are eligible for WFH.
Prior Approval by Approving authority. It's at the discretion of approving authority to accept or
reject any request for WFH depending upon the personal situation, business need and job role
that you are performing.
If approving authority would like to avail WFH facility then they have to apply through the HR
portal and get approval from their reporting authority as well.
Prior-update to HR and concerned team via email is Mandatory.
Login to system as per the schedule while on WFH. He/she should be available during the
scheduled time to answer any questions.
Participation in any Meetings, Scrum is Mandatory.
Any WFH not approved by the reporting auth. will be treated as EL. In case, EL balance is
insufficient, LWP will be marked for the day.
Maternity leave:
MLs are the paid leaves granted to the female Team Members during pregnancy to take care of
themselves and their baby's health.
Fulltime confirmed female members are eligible for paid maternity leave.
More provision and benefits of Maternity leaves can be provided upon enquiry.
Female Team Member should inform her Lead, Manager and respective Team at least three
months in advance about the plan of ML.
Female Team Member needs to share the expected date of delivery.
Female Team Member may also need to share the doctor's certificate, in case needed.
MLs cannot be en-cashed, nor carried forward.
MLs can not be clubbed with any other type of leave.
In case of miscarriage (defined as per the Maternity Benefit Act 1961) or medical termination of
pregnancy or birth of a still born child, a female Team Member shall be entitled to ML for 1 week
immediately following the day of her miscarriage.
In case of voluntary termination of pregnancy, this benefit will not be offered. The medical
certificate needs to be submitted to HR for the same.
Paternity Leave:
All Male Team Members are eligible for two days of PL which can be applied for and availed
within 1 month of the child's birth, including the date of child's birth."""

# Leave Policy Summary for quick reference
LEAVE_POLICY_SUMMARY = {
    "Earned Leave (EL)": {
        "description": "Regular leaves earned monthly",
        "accrual": {
            "First year": "4.5 EL after 3 months, then 1.5/month",
            "1-3 years": "1.5 EL/month (18/year)",
            "3+ years": "2 EL/month (24/year)"
        },
        "limits": {
            "max_accumulation": "45 days",
            "encashment": "Up to 15 days per year",
            "exit_encashment": "Up to 10 days"
        }
    },
    "Compensatory Leave (CL)": {
        "description": "Given for working on holidays/weekends",
        "rules": [
            "Must be availed within 60 days",
            "Cannot be encashed or carried forward",
            "Can be clubbed with EL",
            "Requires official approval"
        ]
    },
    "Maternity Leave (ML)": {
        "description": "For female employees during pregnancy",
        "rules": [
            "Cannot be encashed or carried forward",
            "Cannot be clubbed with other leaves",
            "Requires 3 months advance notice"
        ]
    },
    "Paternity Leave (PL)": {
        "description": "For male employees",
        "duration": "2 days",
        "timing": "Within 1 month of child's birth"
    },
    "Work from Home (WFH)": {
        "description": "Remote work option",
        "limits": {
            "max_days": "12 per calendar year",
            "eligibility": "Lead and above positions"
        },
        "requirements": [
            "Prior approval required",
            "Email notification mandatory",
            "Must be available during work hours",
            "Must attend all meetings"
        ]
    },
    "General Rules": {
        "application": "15 days advance notice required",
        "emergency": "Apply within 1 day of resuming",
        "unplanned": "May be marked as LWP",
        "half_day": "Permissible for all leave types"
    }
}

def format_leave_info(leave_info: Dict[str, Any]) -> Dict[str, Any]:
    """Format leave information for easy understanding"""
    return {
        "Leave Balance": {
            "description": "Your current available leaves for different types",
            "data": leave_info["balance"]
        },
        "Recent Leave Transactions": {
            "description": "Your leave applications and their status from the last 30 days",
            "data": leave_info["transactions"]
        },
        "Last Updated": leave_info["last_updated"]
    }

def get_hr_bot_prompt(
    user_name: str,
    channel_type: str,
    conversation_history: str,
    user_message: str,
    leave_info: Dict[str, Any],
    leave_policy: str = LEAVE_POLICY
) -> str:
    """
    Generate the prompt for the HR bot with context about leave information and policy.
    
    Args:
        user_name: Name of the user asking the question
        channel_type: Type of channel (dm/channel)
        conversation_history: Previous conversation messages
        user_message: Current message from the user
        leave_info: Dictionary containing leave balance and transactions
        leave_policy: Company leave policy text (defaults to LEAVE_POLICY)
    """
    
    # Format leave information
    leave_context = format_leave_info(leave_info)

    return f"""You are a helpful HR assistant named HRbot. You're talking to {user_name} in a {channel_type} channel.

Previous conversation:
{conversation_history}

Current message from {user_name}:
{user_message}

Available Leave Information:
{json.dumps(leave_context, indent=2)}

Company Leave Policy:
{leave_policy}

Instructions:
1. Focus primarily on answering the user's specific question. The leave information and policy are context to help you provide accurate answers.

2. When explaining leave concepts:
   - Leave Balance: Shows how many leaves you have available for each type (EL, CL, etc.)
   - Leave Transactions: Shows your recent leave applications, including dates and status

3. Key points about leaves:
   - EL (Earned Leave): Regular leaves earned monthly (1.5-2 days per month based on tenure)
   - CL (Compensatory Leave): Given for working on holidays/weekends
   - Maximum EL accumulation: 45 days
   - EL encashment: Up to 15 days per year
   - Leave application: Must be applied 15 days in advance (except emergencies)
   - Unplanned leaves may be marked as LWP (Leave Without Pay)

4. Response guidelines:
   - Be direct and to the point
   - No emojis or unnecessary fluff
   - If the user's question is unclear, ask for clarification
   - If you're unsure about something, suggest contacting HR
   - Use Slack markdown for formatting (bold, lists, etc.)
   - If the user hasn't asked about specific information, don't provide it

5. For leave balance queries:
   - Show only the relevant leave types
   - Explain any important limits or conditions
   - Mention if any leaves are expiring soon

6. For leave application queries:
   - Explain the application process
   - Mention advance notice requirements
   - Highlight any restrictions or conditions

Please provide a clear, focused response to the user's question.""" 