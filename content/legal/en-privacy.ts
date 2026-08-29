// en/privacy.html 의 본문을 **한 글자도 바꾸지 않고** 옮긴 것입니다.
// scripts/import-legal.mjs 가 한 번 떠 왔고, 지금부터는 이 파일이 원본입니다.
// 법률 문안이라 손으로 고칠 때도 문장 단위로만 손대십시오.

export const body = `<a class="back" href="/en/">← Preaching Lab</a>

  <h1>Privacy Policy</h1>
  <p class="updated">Effective August 27, 2026 · <a href="/privacy">한국어</a></p>

  <p>
    Preaching Lab keeps sermons for you. Sermons routinely carry the names and
    circumstances of real people in a congregation. So this page is specific about
    what we take, where we put it, and when it goes away.
  </p>

  <h2>1. What we collect</h2>

  <div class="wrap">
  <table>
    <tr><th>Category</th><th>What</th><th>Why</th></tr>
    <tr>
      <td>Sign-in</td>
      <td>The unique identifier Google, Apple, or Kakao gives us; your display name; your email if you consented to share it</td>
      <td>So your reports are yours alone. We never receive or store a password.</td>
    </tr>
    <tr>
      <td>Profile</td>
      <td>Your name, church, church YouTube channel, the kind of preacher you want to become, your tradition, and a description of your congregation</td>
      <td>To carry a thread across sermons and to judge a sermon inside your own tradition rather than someone else's. Only the name matters; the rest is optional.</td>
    </tr>
    <tr>
      <td>Language and place</td>
      <td>Your app language, your time zone, your country</td>
      <td>To write the report in your language, and to send notifications at a reasonable hour where you are rather than where our servers are.</td>
    </tr>
    <tr>
      <td>Sermons</td>
      <td>The video or recording link you send, the transcript made from its audio, and the report</td>
      <td>This is the service itself.</td>
    </tr>
    <tr>
      <td>Microphone</td>
      <td>Audio you record inside the app</td>
      <td>The microphone turns on only when you press Record. At no other time do we listen. The recording is deleted once the report is made (see 3).</td>
    </tr>
    <tr>
      <td>Notifications</td>
      <td>A device push token</td>
      <td>To tell you when a report is ready. Decline notifications and the app still works.</td>
    </tr>
  </table>
  </div>

  <p>
    We do not collect location, contacts, photos, or advertising identifiers. We do
    not use your activity for advertising and we hand nothing to advertisers.
    We use no third-party analytics — our own server counts page views with no IP
    address and no cookie.
  </p>

  <div class="box">
    <p style="margin:0">
      <b>A sermon is sensitive information, and not only about you.</b> Preaching
      often names a member who is ill, a family in difficulty, a request made in
      confidence. Under California law your religious beliefs are sensitive personal
      information; the same is true of what your sermon reveals about others. We use
      it for one thing — making your report — and for nothing else. It is never used
      to infer anything about you, never sold, never shared for advertising, and
      never shown to another user.
    </p>
  </div>

  <h2>2. Where it goes</h2>
  <p>
    Turning speech into text and reading it takes outside services. Here is what goes
    where.
  </p>

  <div class="wrap">
  <table>
    <tr><th>Who</th><th>What they get</th><th>What for</th></tr>
    <tr><td>OpenAI</td><td>The audio of the sermon portion</td><td>Turning speech into text</td></tr>
    <tr><td>Anthropic</td><td>The transcript</td><td>Writing the report</td></tr>
    <tr><td>Railway</td><td>Account, reports, transcripts</td><td>Server and database</td></tr>
    <tr><td>Google · Apple · Kakao</td><td>Sign-in verification</td><td>Confirming it is you</td></tr>
    <tr><td>Expo</td><td>Push token and notification text</td><td>Sending notifications</td></tr>
    <tr><td>Cloudflare</td><td>Audio you recorded in the app</td><td>Holding the file while the report is made</td></tr>
    <tr><td>Cloudflare · Resend</td><td>The email address on a sign-up form</td><td>The website and its reply mail</td></tr>
  </table>
  </div>

  <p>
    <b>What we send to OpenAI and Anthropic is processed under terms that forbid
    using it to train their models.</b> We do not hand anything to anyone outside
    this list. We do not sell your information, and we do not share it for
    cross-context behavioral advertising. We disclose it otherwise only where the law
    lawfully requires it.
  </p>

  <h2>3. International transfer</h2>
  <p>
    <b>Preaching Lab is operated from the Republic of Korea, and your account,
    transcripts, and reports are stored there.</b> The services in the table above
    are located in the United States and elsewhere, so your sermon crosses borders in
    the course of being transcribed and read. By using the service you understand
    that this is where your data lives. It is protected the same way wherever it sits
    — see Section 7.
  </p>

  <h2>4. How long we keep it</h2>
  <ul>
    <li>
      <b>Account, reports, transcripts</b> — until you delete your account. Showing
      you how your preaching has changed over time is the point of this service, so
      we do not quietly discard the record it rests on.
    </li>
    <li>
      <b>Audio we downloaded</b> — kept on the processing machine only while the
      report is being made, then deleted. Never stored on our server.
    </li>
    <li>
      <b>Audio you recorded in the app</b> — deleted as soon as the report is ready.
      Anything that failed part-way is deleted automatically after 7 days. We never
      keep it permanently; the transcript and the report remain, so there is no reason
      to hold the original.
    </li>
    <li>
      <b>If you delete your account</b> — everything above goes with it, reports and
      transcripts included. This cannot be undone.
    </li>
  </ul>

  <h2>5. How to delete</h2>
  <p>
    In the app: <b>My Sermons → your name at the bottom → Delete account</b>. It
    happens immediately. You do not have to ask anyone or wait. You can also write to
    hello@preachinglab.cloud.
  </p>

  <h2>6. Your rights</h2>
  <p>
    You may ask at any time to see, correct, or delete what we hold, or to stop us
    processing it. Write to the address below and we will do it.
  </p>
  <p>
    <b>If you live in California</b>, you have the right to know what we collect and
    why, to get a copy, to correct it, to delete it, and to limit our use of sensitive
    personal information — and we will not treat you differently for exercising any of
    them. As stated above, we do not sell personal information and do not share it for
    cross-context behavioral advertising, so there is nothing to opt out of. We use the
    sensitive information in your sermons solely to provide the service you asked for,
    which is the use California law permits without a separate opt-out. Use the same
    address; you may designate an authorized agent to ask on your behalf.
  </p>
  <p>
    <b>This service is not for children.</b> We do not direct it at anyone under 13
    and do not knowingly accept their sign-up. If we learn we have taken a child's
    information, we delete it.
  </p>

  <h2>7. How we protect it</h2>
  <ul>
    <li>Everything in transit is encrypted with HTTPS.</li>
    <li>The database is not exposed to the internet; we connect through an encrypted tunnel only when processing requires it.</li>
    <li>
      A report opens only under the account that owns it. Ask for someone else's and
      we will not even tell you whether it exists.
    </li>
  </ul>

  <h2>8. When this changes</h2>
  <p>
    We revise this page and update the date at the top. Significant changes are
    announced in the app or by email.
  </p>

  <h2>9. Contact</h2>
  <p>
    Privacy contact — Preaching Lab<br>
    hello@preachinglab.cloud
  </p>`;
