import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { useRoute } from '@react-navigation/native'
import { commonStyles } from "../constants/commonStyles";


export default function TermsScreen(props) {
    const route = useRoute()
    const isTermsConditions = route?.params?.isTermsConditions
    return (
        <View style={styles.fullScreenContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    isTermsConditions ?
                        <Text style={commonStyles.textWhiteNormal(16, { color: colors.green, textAlign: 'center' })}>
                            Terms and Conditions
                            THE AGREEMENT: The use of this website and services on this App provided by AfroMelodiez (hereinafter referred to as "App") are subject to the following Terms & Conditions, all parts and sub-

                            Terms and Conditions
                            THE AGREEMENT: The use of this website and services on this App provided by AfroMelodiez (hereinafter referred to as "App") are subject to the following Terms & Conditions, all parts and sub-parts of which are specifically incorporated by reference here. This Agreement shall govern the use of all pages on this App (hereinafter collectively referred to as "App") and any services provided by or on this App ("Services").

                            DEFINITIONS
                            “Agreement” denotes to this Terms and Conditions and the Privacy Policy and other documents provided to you by the App.

                            “We,” “us,” and “our” are references to AfroMelodiez.

                            “User,” “You,” and “your” denotes the person who is accessing the App for taking or availing any service from us. User shall include the Company, partnership, sole trader, person, body corporate, or association taking services of this App.

                            ” App” shall mean and include AfroMelodiez and any successor App of the Company or any of its affiliates.

                            Parties: Collectively, the parties to this Agreement (We and You) will be referred to as Parties.

                            ASSENT & ACCEPTANCE
                            PLEASE READ THESE TERMS OF USE, OUR PRIVACY POLICY, AND ALL APPLICABLE SUPPLEMENTAL TERMS (COLLECTIVELY, THE "TERMS") CAREFULLY, AS THEY CONTAIN TERMS AND CONDITIONS THAT IMPACT YOUR RIGHTS, OBLIGATIONS, AND REMEDIES IN CONNECTION WITH YOUR USE OF THE SERVICES AND CONTENT. FOR EXAMPLE, THE TERMS INCLUDE:

                            YOUR OBLIGATION TO COMPLY WITH ALL APPLICABLE LAWS AND REGULATIONS.

                            LIMITATIONS OF OUR LIABILITY TO YOU; AND

                            A REQUIREMENT THAT YOU PURSUE CLAIMS OR SEEK RELIEF AGAINST US (INCLUDING MONETARY, INJUNCTIVE, AND DECLARATORY RELIEF) ON AN INDIVIDUAL BASIS, RATHER THAN AS A PARTICIPANT IN ANY CLASS OR REPRESENTATIVE ACTION OR PROCEEDING.

                            YOUR ACCESS TO AND USE OF THE SERVICES IS CONDITIONED ON YOUR ACCEPTANCE OF AND COMPLIANCE WITH ALL APPLICABLE TERMS. If you do not agree to these Terms or our Privacy Policy, then please cease using the Services immediately. We reserve the right to change these Terms at any time (see “Changes to these Terms” below.) By accessing, browsing, and/or using the Services after updates to these Terms have been posted, you agree to be bound by the updated Terms. THESE TERMS AND OUR PRIVACY POLICY CONSTITUTE A BINDING AGREEMENT BETWEEN YOU AND AfroMelodiez.

                            Consequences of Non-Compliance
                            Your failure to comply with the Terms may result in the suspension or termination of your account and/or access to the Services and may subject you to civil and criminal penalties.

                            AGE RESTRICTION
                            You must be at least 13 (Thirteen) years of age to use this App or any Services contained herein. By using this App, you represent and warrant that you are at least 13 years of age and may legally agree to this Agreement. We assume no responsibility or liability for any misrepresentation of your age.

                            LICENSE TO USE APP
                            We may provide you with certain information because of your use of the App or Services. Such information may include but is not limited to documentation, data, or information developed by us and other materials which may assist in your use of the App or Services ("Our Materials"). Subject to this Agreement, we grant you a non-exclusive, limited, non-transferable, and revocable license to use Our Materials solely in connection with your use of the App and Services. Our Materials may not be used for any other purpose, and this license terminates upon your cessation of use of the App or Services or at the termination of this Agreement.

                            USER ACCOUNT, LOGIN, AND PASSWORD
                            After the account registration, it will be the responsibility of the user to keep your login information confidential. The user alone will be responsible for any activity that happens under his/her account whether they have authorized it. If any user or account holder of our website has a reason to believe that their account and/or login information has been compromised, they are requested to contact Apple or Google if they are using their credentials. Users can also contact us through email if they have used e-mail and username to register their account.

                            USER CONTENT
                            Content Responsibility.
                            The App permits you to share content, post comments, feedback, etc., but you are solely responsible for the content posted by you. You represent that you have required permission to use the content.

                            When posting content to the App, please do not post content that:

                            contains ill-mannered, profane, abusive, racist, or hateful language or expressions, text, photographs, or illustrations that are pornographic or in poor taste, inflammatory attacks of a personal, racial or religious nature.

                            It is defamatory, threatening, disparaging, grossly inflammatory, false, misleading, fraudulent, inaccurate, unfair, contains exaggeration or unsubstantiated claims.

                            Violating the privacy rights of any third party is unreasonably harmful or offensive to any individual or community.

                            Discriminates on the grounds of race, religion, national origin, gender, age, marital status, sexual orientation, or disability, or refers to such matters in any manner prohibited by law.

                            Violates or inappropriately encourages the violation of any municipal, state, federal, or international law, rule, regulation, or ordinance.

                            Uses or attempts to use another's account, password, service, or system except as expressly permitted by the Terms of use uploads or transmits viruses or other harmful, disruptive, or destructive files.

                            Sends repeated messages related to another user and/or makes derogatory or offensive comments about another individual or repeats prior posting of the same message under multiple e-mails or subjects.

                            Any submitted content that includes, but is not limited to the following, will be refused. If repeated violations occur, we reserve the right to cancel user access to the App without advanced notice.

                            INTELLECTUAL PROPERTY
                            You agree that the App and all Services provided by us are the property of AfroMelodiez, including all copyrights, trademarks, trade secrets, patents, and other intellectual property ("Our IP"). You agree that we own all rights, title, and interest in and to the Our IP and that you will not use Our IP for any unlawful or infringing purpose. You agree not to reproduce or distribute Our IP in any way, including electronically or via registration of any new trademarks, trade names, service marks, or Uniform Resource Locators (URLs), without express written permission from us.

                            COPYRIGHT NOTICES
                            We will have other author’s work, material, and content through our AfroMelodiez app. It’s possible that we may not be able to check each and every work or material by an author for copyright infringement. If you have a reason to believe that your copyright work has been used in any of our services, in the app, or on or anywhere on our website that constitutes copyright infringement, please provide us information according to the method stated below. This procedure has been drafted in accordance with the Digital Millennium Copyright Act (“DMCA”).

                            All infringement notifications must be submitted in writing to our website’s DMCA Agent at the email

                            address listed below, and must include the following:

                            Any kind of Identification of the infringed copyrighted work(s).

                            Identification of the material or link allegedly hosting the infringing content.

                            Details of the owners whose copyrighted work is being infringed. Details may include information such as mailing address, e-mail address, telephone number.

                            The authorization statement of the claimant with the following wording:

                            "I hereby state that I have a good faith belief that the use of the copyrighted material is not authorized by the copyright owner, its agent, or the law," and

                            "I hereby state that the information in this Notice is accurate and under penalty of perjury, that I am the owner or am authorized to act on behalf of the owner of the copyright that is allegedly infringed;"

                            The full name and electronic or physical signature of the copyright owner or the copyright owner's agent.

                            DMCA Agent of AfroMelodiez

                            info@afromelodiez.com.

                            USER OBLIGATIONS
                            As a user of the App or Services, you may be asked to register with us. When you do so, you will choose a user identifier, which may be your e-mail address or another term, as well as a password. You may also provide personal information, including, but not limited to, your name. You are responsible for ensuring the accuracy of this information. This identifying information will enable you to use the App and Services. You must not share such identifying information with any third party, and if you discover that your identifying information has been compromised, you agree to notify us immediately in writing. An e-mail notification will suffice. You are responsible for maintaining the safety and security of your identifying information, as well as keeping us apprised of any changes to your identifying information. Providing false or inaccurate information or using the App or Services to further fraud or unlawful activity is grounds for immediate termination of this Agreement.

                            ACCEPTABLE USE
                            You agree not to use the App or Services for any unlawful purpose, or any purpose prohibited under this clause. You agree not to use the App or Services in any way that could damage the App, Services, or general business of AfroMelodiez.

                            You further agree not to use the App or Services:

                            To harass, abuse, or threaten others or otherwise violate any person's legal rights.

                            To violate any of our intellectual property rights or any third party.

                            To upload or otherwise disseminate any computer viruses or other software that may damage the property of another.

                            To perpetrate any fraud.

                            To engage in or create any unlawful gambling, sweepstakes, or pyramid scheme.

                            To publish or distribute any obscene or defamatory material.

                            To publish or distribute any material that incites violence, hate, or discrimination towards any group.

                            To unlawfully gather information about others.

                            REVERSE ENGINEERING & SECURITY
                            You agree not to undertake any of the following actions:

                            a) Reverse engineer or attempt to reverse engineer or disassemble any code or software from or on the App or Services.

                            b) Violate the security of the App or Services through any unauthorized access, circumvention of encryption or other security tools, data mining, or interference to any host, user, or network.

                            SECTION ENDORSEMENT DISCLAIMER
                            AfroMelodiez will have access to several different authors, writers, and professionals related to different fields of life. However, we do not endorse, recommend, approve, or certify any information, advice, service, product, material, content, or process, presented, or mentioned through our app and/or website and none of the information from our app and/or website should be referenced in any way to imply any kind of approval or endorsement. We will not assume any liability for the accuracy or completeness of the information provided through our app or website’s content. We also do not warrant that our hosting services, streaming platforms, or servers will be free from trojans, worms, viruses, or other similar codes. Therefore, users are requested to use our services at their own risk.

                            PODCAST AND INTERVIEW WAIVER RELEASE
                            Unless otherwise agreed, the guests and interviewees of the AfroMelodiez app hereby assign and grant us the rights to use their voice, image, likeness, and permit them to publish, record the voice and video, publish, live stream, or distribute interviews or talks with them. The guests and interviewees understand that the distribution can be used for monetary gains or otherwise sale for which they will not demand any share of profits or sales. Furthermore, the guests and interviewees agree that they will not bring any lawsuit, action, claim, or demand of any kind against the producers and owners of My Buug, its employees and members, agents, affiliates, and its assignees.

                            INDEMNIFICATION
                            You agree to defend and indemnify us and any of our affiliates (if applicable) and hold us harmless against any legal claims and demands, including reasonable attorney's fees, which may arise from or relate to your use or misuse of the App or Services, your breach of this Agreement, or your conduct or actions. You agree that we shall be able to select its legal counsel and may participate in its defense if we wish.

                            EXCLUSION OF LIABILITY
                            You understand and agree that we (A) do not guarantee the accuracy, completeness, validity, or timeliness of information listed by us or any third parties, and (B) shall not be responsible for any materials posted by us or any third party. You shall use your judgment, caution, and common sense in evaluating any prospective methods or offers and any information provided by us or any third party.

                            Further, we shall not be liable for direct, indirect consequential, or any other form of loss or damage that may be suffered by a user using the AfroMelodiez App, including loss of data or information or any kind of financial or physical loss or damage.

                            In no event shall AfroMelodiez, nor its Owner, directors, employees, partners, agents, suppliers, or affiliates, be accountable for any indirect, incidental, special, eventful, or exemplary costs, including without limitation, loss of proceeds, figures, usage, goodwill, or other intangible losses, consequential from (i) your use or access of or failure to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content attained from the Service; and (iv) unlawful access, use or alteration of your transmissions or content, whether or not based on guarantee, agreement, domestic wrong (including carelessness) or any other lawful concept, whether or not we've been aware of the possibility of such damage, and even if a cure set forth herein is originated to have futile of its important purpose.

                            SPAM POLICY
                            You are strictly prohibited from using the App or any of our Services for illegal spam activities, including gathering e-mail addresses and personal information from others or sending any mass commercial e-mails.

                            THIRD-PARTY LINKS & CONTENT
                            We may occasionally post links to third-party apps or other services. You agree that we are not responsible for any loss or damage caused because of your use of any third-party services linked to or from Our App.

                            MODIFICATION & VARIATION
                            We may, from time to time and at any time without notice to you, modify this Agreement. You agree that we have the right to modify this Agreement or revise anything contained herein. You further agree that all modifications to this Agreement are in full force and effect immediately upon posting on the App and that modifications or variations will replace any prior version of this Agreement unless prior versions are specifically referred to or incorporated into the latest modification or variation of this Agreement.

                            ENTIRE AGREEMENT
                            This Agreement constitutes the entire understanding between the Parties concerning any use of this App. This Agreement supersedes and replaces all prior or contemporaneous agreements or understandings, written or oral, regarding the use of this App.

                            SERVICE INTERRUPTIONS
                            We may need to interrupt your access to the App to perform maintenance or emergency services on a scheduled or unscheduled basis. You agree that your access to the App may be affected by unanticipated or unscheduled downtime for any reason but that we shall have no liability for any damage or loss caused because of such downtime.

                            TERM, TERMINATION & SUSPENSION
                            We may terminate this Agreement with you at any time for any reason, with or without cause. We specifically reserve the right to terminate this Agreement if you violate any of the terms outlined herein, including, but not limited to, violating the intellectual property rights of us or a third party, failing to comply with applicable laws or other legal obligations, and/or publishing or distributing illegal material. If you have registered for an account with Us, you may also terminate this Agreement at any time by contacting us and requesting termination. At the termination of this Agreement, any provisions that would be expected to survive termination by their nature shall remain in full force and effect.

                            “AS IS” and “AS AVAILABLE” Disclaimer
                            The Service is provided to You “AS IS” and “AS AVAILABLE” and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory, or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of a course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing, the Company provides no warranty or undertaking, and makes no representation of any kind that the Service will meet Your requirements, achieve any intended results, be compatible or work with any other software, applications, systems, or services, operate without interruption, meet any performance or reliability standards or be error-free or that any errors or defects can or will be corrected.

                            Without limiting the foregoing, neither the Company nor any of the Company’s provider makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service, or the information, content, and materials or products included thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.

                            Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable statutory rights of a consumer, so some or all the above exclusions and limitations may not apply to You. But in such a case, the exclusions and limitations set forth in this section shall be applied to the greatest extent enforceable under applicable law.

                            NO WARRANTIES
                            You agree that your use of the App and Services is at your sole and exclusive risk and that any Services provided by us are on an "As Is" basis. We hereby expressly disclaim any express or implied warranties of any kind, including but not limited to the implied warranty of fitness for a particular purpose and the implied warranty of merchantability. We make no warranties that the App or Services will meet your needs or that the App or Services will be uninterrupted, error-free, or secure. We also make no warranties as to the reliability or accuracy of any information on the App or obtained through the Services. You agree that any damage that may occur to you through your computer system or because of the loss of your data from your use of the App or Services is your sole responsibility and that we are not liable for any such damage or loss.

                            LIMITATION ON LIABILITY
                            We are not liable for any damages that may occur to you because of your use of the App or Services, to the fullest extent permitted by law. This section applies to any claims by you, including, but not limited to, lost profits or revenues, consequential or punitive damages, negligence, strict liability, fraud, or torts of any kind.

                            GENERAL PROVISIONS:
                            JURISDICTION, VENUE & CHOICE OF LAW: The terms herein will be governed by and construed by the laws of Sweden without giving effect to any principles of conflicts of law. The Courts of Sweden shall have exclusive jurisdiction over any dispute arising from the use of the App.

                            ASSIGNMENT: This Agreement, or the rights granted hereunder, may not be assigned, sold, leased, or otherwise transferred in whole or part by you. Should this Agreement, or the rights granted hereunder, be assigned, sold, leased, or otherwise transferred by us, the rights and liabilities of AfroMelodiez will bind and inure to any assignees, administrators, successors, and executors.

                            SEVERABILITY: If any part or sub-part of this Agreement is held invalid or unenforceable by a court of law or competent arbitrator, the remaining parts and sub-parts will be enforced to the maximum extent possible. In such a condition, the remainder of this Agreement shall continue in full force.

                            NO WAIVER: If we fail to enforce any provision of this Agreement, this shall not constitute a waiver of any future enforcement of that provision or any other provision. Waiver of any part or sub-part of this Agreement will not constitute a waiver of any other part or sub-part.

                            HEADINGS FOR CONVENIENCE ONLY: Headings of parts and sub-parts under this Agreement are for convenience and organization only. Headings shall not affect the meaning of any provisions of this Agreement.

                            NO AGENCY, PARTNERSHIP, OR JOINT VENTURE: No agency, partnership, or joint venture has been created between the Parties because of this Agreement. No Party has any authority to bind the other to third parties.

                            FORCE MAJEURE: We are not liable for any failure to perform due to causes beyond its reasonable control, including, but not limited to, acts of God, acts of civil authorities, acts of military authorities, riots, embargoes, acts of nature, and natural disasters, and other acts which may be due to unforeseen circumstances, i.e., COVID-19!

                            ELECTRONIC COMMUNICATIONS PERMITTED: Electronic communications are permitted to both Parties under this Agreement, including e-mail. For any questions or concerns, please use the contact us form on the App or e-mail us at info@afromelodiez.com.

                            This document was last updated on February 26, 2022
                        </Text>
                        :
                        <Text style={commonStyles.textWhiteNormal(16, { color: colors.green, textAlign: 'center' })}>
                            Privacy Policy
                            THE AGREEMENT: We know that in this digital age, your privacy is important. This Privacy Policy reflects our commitment to protect personal data and the choices we offer you regarding how you


                            We know that in this digital age, your privacy is important. This Privacy Policy reflects our commitment to protect personal data and the choices we offer you regarding how your data is used. We welcome you to read more about how we keep your information safe, as well as how you can exercise your rights. In addition, our Privacy policy covers our treatment of data that may be personal to you.

                            ‍We will review, update, and amend these policies from time to time consistent with our business needs and technology. We encourage you to check back periodically for new updates or changes. Your continued use of the service makes up your acceptance of any change to this Privacy Policy. We are the data controller of your information. We handle and process all data on behalf of our customers

                            You may likewise decide not to give us "discretionary" Personal Data; however, please remember that without it, we will most likely be unable to provide you with the full scope of our administrations or with the best client experience when utilizing our Services.

                            This Privacy Policy ("Privacy Policy") describes how AfroMelodiez. Will gather, use, and maintain your Personal Information on the AfroMelodiez. It will also explain your legal rights with respect to that information.

                            By using the App or website, you confirm that you have read and understood this Privacy Policy and our Terms (together referred to herein as the "Agreement"). The Agreement governs the use of AfroMelodiez. We will collect, use, and maintain information consistent with the Agreement.

                            The app does use third-party services that may collect information used to identify you. Link to the privacy policy of third-party service providers used by the App Google Play Services Apple iOS

                            What private data do we collect from the people who visit our App?
                            When you create an account and use the Services, including through a third-party platform, we collect any data you provide directly, including:

                            Account Data: To use certain features (like Paid or unpaid Services), you need to create a user account. When you create or update your account, we collect and store the data you provide, like your email address name, and assign you a unique identifying number ("Account Data").

                            Personal Data: Personal Data is information that can be used to identify you specifically, including your name, email address, telephone number. You consent to give us this information by providing it to us voluntarily on our mobile Application. Your decision to disclose this data is entirely voluntary. You are under no obligation to provide this information, but your refusal may prevent you from accessing certain benefits from our App.

                            For a better experience, while using our Service, we may require you to provide us with certain permissions.

                            Permission Group	Permission
                            STORAGE
                            READ_EXTERNAL_STORAGE

                            WRITE_EXTERNAL_STORAGE

                            CAMERA	ACCESS CAMERA

                            We use camera access to upload profile pictures and storage to save files and updates from the App.

                            Automatically collected information about your use of our Services or tools,
                            This information is registered automatically with the visit by own configuration or manual of each tool on the mobile Application

                            When you visit, connect with, or utilize our service, we may gather, record, or create specific specialized data about you. We do so either autonomously or with the assistance of third gathering Service Providers, including using "cookies" and other following innovations.

                            We automatically collect certain information when you visit, use or navigate the Mobile Application. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser, and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Mobile Application and other technical information. This information is primarily needed to maintain the security and operation of our Mobile Application and for our internal analytics and reporting purposes.

                            The information we collect includes:

                            Log and Usage Data. Log and usage data are service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Mobile Application, which we record in log files. Depending on how you interact with us, this log data may include your IP address, device information, browser type, settings, and information about your activity on the Mobile Application (such as the date/time stamps associated with your usage, pages and files viewed, searches and other actions you take such as which features you use), device event information (such as system activity, error reports (sometimes called 'crash dumps') and hardware settings).

                            Device Data. We collect device data such as information about your computer, phone, tablet, or another device you use to access the Mobile Application. Depending on the device used, this device data may include information such as your IP address (or proxy server), device and application identification numbers, location, browser type, hardware model Internet service provider and/or mobile carrier, operating system, and system configuration information.

                            How do we handle social signals?
                            If you choose to register or log in to our mobile Application using a social media account, we may access certain information about you.

                            Our Sites offers you the ability to register and log in using your third-party social media account details (like your Facebook or Google logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile Information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, profile picture, as well as other information you choose to make public.

                            We will use the information we receive only for the purposes described in this privacy policy or that are otherwise made clear to you on the Sites. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy policy to understand how they collect, use, and share your personal information and how you can set your privacy preferences on their sites and apps.

                            The APIs that we use to store and access cookies and other information on your devices. If you are a user currently in the European Union, please look at our EU User Consent Policy.

                            How do we use your details?
                            We may utilize the data we procure from you when you enlist, make a buy, join our bulletin, respond to an examination or promoting correspondence, peruse the App, or utilize specific other App includes in the following ways:

                            Create your account; and

                            To communicate with you about the Services, including Service announcements, updates, or offers.

                            Correspond with you; and

                            Compile anonymous statistical data for our own use or for a third party's use; and

                            Assist law enforcement as necessary; and

                            Prevent fraudulent activity on our website or mobile App; and

                            Analyze trends to improve our website and offerings.

                            To fulfill or meet the reason you provided the information (e.g., to help provide our Site services to you).

                            To personalize and develop our site and the services we provide you and improve our offerings.

                            To provide certain features or functionality of the services on the site.

                            For marketing and promotions.

                            To create, maintain, customize, and secure your account with us.

                            To provide you with support, to communicate with you and respond to your inquiries, including to investigate and address your concerns and monitor and improve our responses.

                            To personalize your experience and to deliver content and services relevant to your interests.

                            To help maintain the safety, security, and integrity of our site, services, databases, and other technology assets and business.

                            To respond to law enforcement requests and as required by applicable law, court order, or governmental regulations.

                            To prevent illegal activity, fraud, and abuse.

                            To help our site that will be ready to serve you better.

                            Do we use 'cookies?
                            Yes. Cookies are small documents App or its provider exchanges to your computer's hard drive or Mobile device through Application (if you allow) that permit the App's or service provider's systems to identify your Mobile devices and capture please remember certain information. For example, we use cookies to help us keep in mind and process things on our devices. Also, they are used to help us understand your requirements based on prior or current App activity, which permits us to offer you improved upon services. We also use cookies to help us put together aggregate data about App traffic and App conversation so that people may offer better App experience and tools in the foreseeable future.

                            We use cookies to:
                            Understand and save users' tastes for future views or visits of our App.

                            Detecting and preventing fraudulent activity and improving security.

                            Compile aggregate data about App traffic and App connections to provide better App activities and tools in the foreseeable future.

                            We might also use third-party services that monitor these details on our behalf.

                            Third-Party Cookies and other tracking technology
                            Service	Description
                            Facebook Pixel

                            _fpb,datr,dpr,fr,wd

                            Collects anonymous statistics regarding usage of the AfroMelodiez App. These are third-party cookies. While AfroMelodiez's use of Facebook causes these cookies to be used, AfroMelodiez itself does not control the data within the cookies themselves. The names of the cookies listed are provided as examples. AfroMelodiez does not directly control the names of the cookies involved, and the actual names may differ.

                            These cookies enable us to:

                            Determine the effectiveness of certain marketing campaigns

                            Collect additional anonymous statistics (see below)

                            You can learn more about Facebook's Tracking Pixel here

                            Google Analytics (_ga, _gat, _gid)	This is a web analytics service provided by Google Inc, which uses cookies to show us how visitors found and explored our site and how we can enhance their experience. It provides us with information about the behavior of our visitors (e.g., how long they stayed on the site, the average number of pages viewed) and also tells us how many visitors we have had.
                            We use CONSENT (gstatic.com) cookies - they expire in 9 years.
                            Google Analytics for Firebase	Google Analytics for Firebase uses device identifiers to collect and store information such as the number of sessions per user, session duration, operating system, device models, geography, first launches, and app updates.
                            Google Authentication	Google Authentication allows us to authenticate users to the AfroMelodiez App. Every time a user signs in, the user credentials are sent to the Google Authentication backend and exchanged for a Google ID token (a JWT) and refresh token. Google ID tokens are short-lived and last for an hour; the refresh token can be used to retrieve new ID tokens.
                            GDPR-Customer data processing appendix:
                            Customer Data" means any personal data that AfroMelodiez processes on behalf of Customer via the Services, as more particularly described in this DPA.

                            "Data Protection Laws" means all data protection laws and regulations applicable to a party's processing of Customer Data under the Agreement, including, where applicable, EU Data Protection Law and Non-EU Data Protection Laws.

                            GDPR-EU data protection law
                            "EU Data Protection Law" means all data protection laws and regulations applicable to Europe, including (i) Regulation 2016/679 of the European Parliament and of the Council on the protection of natural persons with regard to the processing of personal data and on the free movement of such data (General Data Protection Regulation) ("GDPR "); (ii) Directive 2002/58/EC concerning the processing of personal data and the protection of privacy in the electronic communications sector; (iii) applicable national implementations of (i) and (ii); and (iv) in respect of the United Kingdom ("UK ") any applicable national legislation that replaces or converts in domestic law the GDPR or any other law relating to data and privacy as a consequence of the UK leaving the European Union.

                            "Europe" means, for this DPA, the European Union, the European Economic Area and/or their member states, Switzerland, and the United Kingdom.

                            "Non-EU Data Protection Laws" means the California Consumer Privacy Act ("CCPA"); the Canadian Personal Information Protection and Electronic Documents Act ("PIPEDA"); and the Brazilian General Data Protection Law ("LGPD "), Federal Law no. 13,709/2018.

                            "SCCs" means the standard contractual clauses for processors as approved by the European Commission or Swiss Federal Data Protection Authority (as applicable), which shall be applied only to transfers of Customer Data from the European Union.

                            "Services Data" means any data relating to the Customer's use, support, and/or operation of the Services, including information relating to volumes, activity logs, frequencies, bounce rates, or other information regarding emails and other communications Customer generates and sends using the Services.

                            Parties' roles: If EU Data Protection Law or the LGPD applies to either party's processing of Customer Data, the parties acknowledge and agree that concerning the processing of Customer Data, Customer is the controller and is a processor acting on behalf of Customer, as further described in Annex A (Details of Data Processing) of this DPA.

                            Purpose limitation: AfroMelodiez shall process Customer Data only following Customer's documented lawful instructions as outlined in this DPA, as necessary to comply with applicable law, or as otherwise agreed in writing ("Permitted Purposes"). The parties agree that the Agreement sets out the Customer's complete and final instructions to AfroMelodiez concerning the processing of Customer Data. Processing outside the scope of these instructions (if any) shall require a prior written agreement between the parties.

                            Prohibited data. Customer will not provide (or cause to be provided) any Sensitive Data to AfroMelodiez for processing under the Agreement, and AfroMelodiez will have no liability whatsoever for Sensitive Data, whether in connection with a Security Incident or otherwise. To avoid doubt, this DPA will not apply to Sensitive Data.

                            Customer compliance: Customer represents and warrants that (i) it has complied, and will continue to comply, with all applicable laws, including Data Protection Laws, in respect of its processing of Customer Data and any processing instructions it issues to AfroMelodiez; and (ii) it has provided, and will continue to provide, all notice and has obtained, and will continue to obtain, all consents and rights necessary under Data Protection Laws for AfroMelodiez to process Customer Data for the purposes described in the Agreement. Customer shall have sole responsibility for the accuracy, quality, and legality of Customer Data and how Customer acquired Customer data. Without prejudice to the generality of the preceding, Customer agrees that it shall be responsible for complying with all laws (including Data Protection Laws) applicable to any emails or other content created, sent, or managed through the service, including those relating to obtaining consents (where required) to send emails, the content of the emails and its email deployment practices.

                            The lawfulness of Customer's instructions: Customer will ensure that United Kingdom processing of the Customer Data by Customer's instructions will not cause AfroMelodiez to violate any applicable law, regulation, or rule, including, without limitation, Data Protection Laws. AfroMelodiez shall promptly notify Customer in writing unless prohibited from doing so under EU Data Protection Laws if it becomes aware or believes that any data processing instruction from Customer violates the GDPR or any UK implementation of the GDPR.

                            CCPA Notice
                            The California Consumer Privacy Act (CCPA) is an act enacted for the residents of the USA and specifically for the residents of the state of California. This law provides additional protections and rights for the protection of personal information for California residents. Our website does not sell personal information for monetary consideration; however, we do work with and share personal information with certain partners and third parties as described in SECTION 6 (PROTECTION AND SHARING OF CONSUMERS AND USERS DATA) of this Privacy Policy. Under CCPA, as a user or consumer, you hold certain rights that apply to the collection, storing, and sharing of your personal information. If you would like to exercise your rights as a California resident for the uses described above, you may do so by emailing us with your request to Do Not Sell my information. You can contact us to exercise your right under CCPA by Emailing us at  info@afromelodiez.com .

                            Under CCPA, you have the following rights as a consumer, user, and purchaser:

                            Know what personal data is being collected.

                            Know whether your personal data is sold or disclosed and to whom.

                            Access to your personal data.

                            Request to delete any personal information about you.

                            They have the right to know how our website (including tools and protocols) collects their

                            personal data.

                            Your Legal Rights
                            Under certain circumstances, you have rights under data protection laws in relation to your personal data.

                            You may have the following rights: -
                            Request access to your personal data (commonly known as a "data subject access request"). This enables you to receive a copy of the personal data we hold about you and to check that we are lawfully processing it.

                            Request correction of the personal data that we hold about you. This enables you to have any incomplete or inaccurate data we hold about you corrected, though we may need to verify the accuracy of the new data you provide to us.

                            Request deletion of your personal data. This enables you to ask us to delete or remove personal data where there is no good reason for us to continue to process it. You also have the right to ask us to delete or remove your personal data where you have successfully exercised your right to object to processing (see below), where we may have processed your information unlawfully or where we are required to erase your personal data to comply with local law. Note, however, that we may not always be able to comply with your request of erasure for specific legal reasons, which will be notified to you, if applicable, at the time of your request.

                            Object to processing of your personal data where we are relying on a legitimate interest (or those of a third party), and there is something about your situation which makes you want to object to processing on this ground as you feel it impacts on your fundamental rights and freedoms. You also have the right to object to where we are processing your personal data for direct marketing purposes. In some cases, we may demonstrate that we have compelling legitimate grounds to process your information which override your rights and freedoms.

                            Request restriction of processing of your personal data. This enables you to ask us to suspend the processing of your personal data in the following scenarios:

                            If you want us to establish the data's accuracy.

                            Where our use of the data is unlawful, but you do not want us to erase it.

                            Where you need us to hold the data even if we no longer require it as you need it to establish, exercise, or defend legal claims.

                            You have objected to our use of your data, but we need to verify whether we have overriding legitimate grounds to use it.

                            Request the transfer of your personal data to you or to a third party. We will provide to you, or a third party you have chosen, your personal data in a structured, commonly used, machine-readable format. Note that this right only applies to automated information which you initially provided consent for us to use or where we used the information to perform a contract with you.

                            Withdraw consent at any time where we are relying on consent to process your personal data. However, this will not affect the lawfulness of any processing carried out before you withdraw your consent. If you withdraw your consent, we may not be able to provide certain services to you.

                            How do we protect your details?
                            We have implemented industry-accepted administrative, physical, and technology-based security measures to protect against the loss, misuse, unauthorized access, and alteration of personal information in our systems. We ensure that any employee, contractor, corporation, organization, or vendor who has access to personal information in our systems are subject to legal and professional obligations to safeguard that personal information.

                            We do not use vulnerability scanning and/or scanning to PCI specifications.

                            We use regular Malware Scanning.

                            Your individual information is comprised behind secured systems and is merely accessible by a restricted number of folks who've special access privileges to such systems and must keep the information confidential carefully. Furthermore, all very sensitive/credit information you resource is encrypted via Secure Socket Layer (SSL) technology.

                            We implement several security measures whenever a user gets into, submits, or accesses their information to keep up the protection of your individual information.

                            While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the Internet or form of electronic storage is 100 percent secure. Therefore, we cannot guarantee its absolute security.

                            AfroMelodiez prohibits unauthorized access or use of personal information stored on our servers. Such access is a violation of law, and we will fully investigate and press charges against any party that has illegally accessed the information within our systems.

                            Can-spam act
                            The CAN-SPAM Act is a regulation that sets the guidelines for commercial email, establishes requirements for commercial announcements, offers recipients to have emails ceased from being delivered to them, and spells out hard fines for violations.

                            We accumulate your email to be able to:
                            Send information, react to questions, and/or other demands or questions

                            To maintain compliance with CANSPAM, we consent to the next:

                            Not use untrue or misleading subject matter or email addresses.

                            Identify the concept as an advertisement in some realistic way.

                            Include the physical address of our App headquarters or business

                            Screen third-party email marketing services for conformity, if one can be used.

                            Honor opt-out/unsubscribe demands quickly.

                            Allow users to unsubscribe utilizing the link at the bottom of every email.

                            If anytime you want to unsubscribe from receiving future emails, you can email us by using the contact form at our App AfroMelodiez, and we'll immediately remove you from ALL communication.

                            Limitation of liability
                            Some jurisdictions do not allow the limitation or exclusion of liability for incidental or consequential damages, so some of the above limitations may not apply to you.

                            We make no legal representation that the App or content is appropriate or available for use in locations outside Sweden. You may access the App from outside Sweden. At your own risk and initiative and must bear all responsibility for compliance with any applicable foreign laws.

                            Governing Law and Jurisdiction
                            This App originates from Sweden. The laws of Sweden. Without regard to its conflict of law, principles will govern these terms to the contrary. You hereby agree that all disputes arising out of or in connection with these terms shall be submitted to the exclusive jurisdiction of Sweden. By using this App, you consent to the jurisdiction and venue of such courts in connection with any action, suit, proceeding, or claim arising under or by reason of these terms. You hereby waive any right to trial by jury arising out of these terms.

                            Changes to this privacy notice
                            We reserve the right to alter this privacy notice at any time. Such alterations will be posted on our App. You can also obtain an up-to-date copy of our privacy notice by contacting us.

                            Contacting us
                            If you would like to contact us to understand more about this Policy or wish to contact us concerning any matter relating to individual rights and your Personal Information, you may do so via the contact us or email us at info@afromelodiez.com.

                            This document was last updated on February 26, 2022
                        </Text>}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        backgroundColor: colors.black,
        padding: 15
    }
})