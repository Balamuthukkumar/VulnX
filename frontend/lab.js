document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    let labKey = params.get("lab");

    // Enable navigation for start-lab buttons if triggered on labs.html
    document.querySelectorAll(".start-lab").forEach(button => {
        button.addEventListener("click", () => {
            const lab = button.getAttribute("data-lab");
            if (lab) {
                window.location.href = `lab.html?lab=${lab}`;
            }
        });
    });

    const labsData = {
        sql: {
            title: "SQL Injection",
            headerDescription: "Learn how improper handling of user input can allow attackers to manipulate database queries.",
            difficulty: "BEGINNER",
            type: "WEB SECURITY",
            description: "SQL Injection occurs when untrusted user input is directly included in a database query. An attacker may manipulate the query and change how the database processes the request.",
            hint: "Look closely at how the username and password values are used to build the database query. Think about what happens when the input changes the structure of the query.",
            learningDescription: "This lab is designed to demonstrate why applications must never trust user input when constructing database queries.",
            learningPrinciple: "Use parameterized queries / prepared statements to prevent SQL Injection.",
            practiceTitle: "User Login",
            practiceSubtitle: "Enter your credentials to continue.",
            formHtml: `
                <label for="username">Username</label>
                <input type="text" id="username" placeholder="Enter username" autocomplete="off">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Enter password">
                <button type="submit">LOGIN <span>→</span></button>
            `,
            solution: {
                payload: "' OR '1'='1",
                autofill: { "username": "' OR '1'='1", "password": "password123" },
                steps: [
                    "Go to the Practice Area login form on the right panel.",
                    "In the <strong>Username</strong> field, enter the payload: <code>' OR '1'='1</code> (or <code>admin' --</code>).",
                    "In the <strong>Password</strong> field, enter any password (e.g. <code>password123</code>).",
                    "Click <strong>LOGIN</strong> to submit the form and trigger the SQL injection vulnerability."
                ],
                explanation: "The application constructs the database query using string concatenation without parameterization: <code>SELECT * FROM users WHERE username = '${username}' AND password = '${password}'</code>. Injecting <code>' OR '1'='1</code> breaks out of the SQL string literal and creates a clause that always evaluates to TRUE, bypassing authentication."
            }
        },

        idor: {
            title: "IDOR",
            headerDescription: "Explore broken access control and discover how insecure object references can expose resources.",
            difficulty: "BEGINNER",
            type: "ACCESS CONTROL",
            description: "Insecure Direct Object Reference (IDOR) occurs when an application uses a user-controlled identifier to access an object without properly checking authorization. This can allow one user to access another user's data.",
            hint: "Look at the resource ID being requested. What happens if you change the ID to another valid user's ID?",
            learningDescription: "This lab is designed to demonstrate how missing authorization checks on object identifiers can expose sensitive user data.",
            learningPrinciple: "Always verify that the authenticated user is authorized to access the requested object.",
            practiceTitle: "User Profile Viewer",
            practiceSubtitle: "Fetch user details by entering a Profile ID.",
            formHtml: `
                <label for="user-id">User Profile ID</label>
                <input type="text" id="user-id" placeholder="Enter Profile ID (e.g. 101)" autocomplete="off" value="101">
                <button type="submit">VIEW PROFILE <span>→</span></button>
            `,
            solution: {
                payload: "102",
                autofill: { "user-id": "102" },
                steps: [
                    "In the Practice Area, locate the <strong>User Profile ID</strong> input field.",
                    "Observe that the default Profile ID <code>101</code> shows standard profile details for Alice Johnson.",
                    "Change the Profile ID input value from <code>101</code> to <code>102</code>.",
                    "Click <strong>VIEW PROFILE</strong> to fetch the administrative user record."
                ],
                explanation: "The backend fetches profile records using the user-supplied <code>user-id</code> integer directly without checking if the current user is authorized to view administrator resources. Accessing ID <code>102</code> exposes Bob Smith's confidential administrator data and secret token."
            }
        },

        xss: {
            title: "Reflected XSS",
            headerDescription: "Learn how unsanitized user input can be reflected back to a browser and become executable code.",
            difficulty: "BEGINNER",
            type: "WEB SECURITY",
            description: "Reflected Cross-Site Scripting (XSS) occurs when user-controlled input is immediately reflected into a web page without proper output encoding. This can allow injected JavaScript to execute in the victim's browser.",
            hint: "Try entering normal text first and observe where it appears in the response. Then consider what happens when the input contains HTML or JavaScript.",
            learningDescription: "This lab is designed to demonstrate how unencoded output reflected back to the browser allows script execution.",
            learningPrinciple: "Properly encode untrusted output and validate input before reflecting it into HTML.",
            practiceTitle: "Site Search",
            practiceSubtitle: "Enter a search term to see reflected output.",
            formHtml: `
                <label for="search-query">Search Query</label>
                <input type="text" id="search-query" placeholder="Search keywords..." autocomplete="off">
                <button type="submit">SEARCH <span>→</span></button>
            `,
            solution: {
                payload: "<script>alert('XSS')</script>",
                autofill: { "search-query": "<script>alert('XSS')</script>" },
                steps: [
                    "In the Practice Area, locate the <strong>Search Query</strong> input field.",
                    "Paste the payload: <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code> into the search box.",
                    "Click <strong>SEARCH</strong> to execute the query.",
                    "Observe how the application reflects the raw payload into the DOM without sanitization, triggering script execution."
                ],
                explanation: "Reflected XSS occurs when user input is rendered directly into the web page document without HTML entity encoding. The browser parses the injected <code>&lt;script&gt;</code> tags as executable code instead of harmless text."
            }
        }
    };

    if (!labKey || !labsData[labKey]) {
        labKey = "sql";
    }

    const currentLab = labsData[labKey];

    const titleEl = document.getElementById("lab-title");
    const headerDescEl = document.getElementById("lab-description");
    const difficultyEl = document.getElementById("lab-difficulty");
    const typeEl = document.getElementById("lab-type");
    const objectiveDescEl = document.getElementById("objective-description");
    const hintEl = document.getElementById("lab-hint");
    const practiceTitleEl = document.getElementById("practice-title");
    const practiceSubtitleEl = document.getElementById("practice-subtitle");
    const formEl = document.getElementById("lab-form");
    const resultEl = document.getElementById("result");
    const learningDescEl = document.getElementById("learning-description");
    const learningPrincipleEl = document.getElementById("learning-principle");

    if (titleEl) titleEl.textContent = currentLab.title;
    if (headerDescEl) headerDescEl.textContent = currentLab.headerDescription;
    if (difficultyEl) difficultyEl.textContent = currentLab.difficulty;
    if (typeEl) typeEl.textContent = currentLab.type;
    if (objectiveDescEl) objectiveDescEl.textContent = currentLab.description;
    if (hintEl) hintEl.textContent = currentLab.hint;
    if (practiceTitleEl) practiceTitleEl.textContent = currentLab.practiceTitle;
    if (practiceSubtitleEl) practiceSubtitleEl.textContent = currentLab.practiceSubtitle;
    if (formEl) formEl.innerHTML = currentLab.formHtml;
    if (learningDescEl) learningDescEl.textContent = currentLab.learningDescription;
    if (learningPrincipleEl) learningPrincipleEl.textContent = currentLab.learningPrinciple;

    if (formEl) {
        formEl.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (!resultEl) return;

            if (labKey === "sql") {
                const username = document.getElementById("username")?.value || "";
                const password = document.getElementById("password")?.value || "";

                try {
                    const response = await fetch("/api/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
                    });

                    if (response.ok) {
                        const message = await response.text();
                        resultEl.textContent = message;
                        return;
                    }
                } catch (err) {
                    // API backend is offline; process locally
                }

                if (username.includes("'") || password.includes("'") || username.toLowerCase().includes("or") || username === "admin") {
                    resultEl.innerHTML = `<span style="color: #65d49a; font-weight: bold;">LOGIN SUCCESSFUL! You exploited the SQL Injection vulnerability.</span><br><small style="color: #89919e; display: block; margin-top: 5px;">Executed Query: SELECT * FROM users WHERE username = '${username}' AND password = '${password}'</small>`;
                } else {
                    resultEl.innerHTML = `<span style="color: #e06c75;">Login failed. Try investigating how the input changes the query structure.</span>`;
                }
            } else if (labKey === "idor") {
                const userId = document.getElementById("user-id")?.value || "";
                const mockDatabase = {
                    "101": { name: "Alice Johnson", email: "alice@vulnx.local", role: "User", notes: "Standard profile" },
                    "102": { name: "Bob Smith", email: "bob.admin@vulnx.local", role: "Administrator", notes: "CONFIDENTIAL: Admin Secret Token = VX_IDOR_TOKEN_9912" },
                    "103": { name: "Charlie Brown", email: "charlie@vulnx.local", role: "User", notes: "User account details" }
                };

                if (mockDatabase[userId]) {
                    const user = mockDatabase[userId];
                    const isUnauthorized = userId === "102";
                    resultEl.innerHTML = `
                        <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 6px; margin-top: 10px;">
                            <strong style="color: #65d49a;">Profile Record #${userId}</strong><br>
                            <strong>Name:</strong> ${user.name}<br>
                            <strong>Email:</strong> ${user.email}<br>
                            <strong>Role:</strong> ${user.role}<br>
                            <strong>Notes:</strong> ${user.notes}<br>
                            ${isUnauthorized ? '<span style="color: #65d49a; font-weight: bold; display: block; margin-top: 8px;">IDOR EXPLOITED: You accessed another user\'s private record!</span>' : ''}
                        </div>
                    `;
                } else {
                    resultEl.innerHTML = `<span style="color: #e06c75;">User ID #${userId} not found. Try testing valid user IDs like 101, 102, or 103.</span>`;
                }
            } else if (labKey === "xss") {
                const query = document.getElementById("search-query")?.value || "";
                if (!query) {
                    resultEl.innerHTML = `<span style="color: #7a838f;">Please enter a search query.</span>`;
                } else if (query.includes("<") || query.includes(">") || query.toLowerCase().includes("script")) {
                    resultEl.innerHTML = `
                        <div style="margin-top: 10px;">
                            <p style="color: #65d49a; font-weight: bold;">REFLECTED XSS TRIGGERED!</p>
                            <p style="color: #89919e; font-size: 11px;">Reflected Output:</p>
                            <div style="background: rgba(255, 255, 255, 0.04); padding: 10px; border-radius: 6px; font-family: monospace;">${query}</div>
                        </div>
                    `;
                } else {
                    resultEl.innerHTML = `Search results for: <strong>${query}</strong> (0 items found)`;
                }
            }
        });
    }

    /* =========================================
       SOLUTION POPUP MODAL CONTROLLER
    ========================================= */

    const solutionModalOverlay = document.getElementById("solution-modal-overlay");
    const viewSolutionBtn = document.getElementById("view-solution-btn");
    const closeSolutionModalBtn = document.getElementById("close-solution-modal");
    const dismissModalBtn = document.getElementById("dismiss-modal-btn");
    const modalLabName = document.getElementById("modal-lab-name");
    const solutionPayloadEl = document.getElementById("solution-payload");
    const copyPayloadBtn = document.getElementById("copy-payload-btn");
    const solutionStepsEl = document.getElementById("solution-steps");
    const solutionExplanationEl = document.getElementById("solution-explanation");
    const autofillBtn = document.getElementById("autofill-btn");

    function openSolutionModal() {
        if (!currentLab || !currentLab.solution || !solutionModalOverlay) return;

        if (modalLabName) modalLabName.textContent = `${currentLab.title} Walkthrough`;
        if (solutionPayloadEl) solutionPayloadEl.textContent = currentLab.solution.payload;

        if (solutionStepsEl && currentLab.solution.steps) {
            solutionStepsEl.innerHTML = currentLab.solution.steps
                .map(step => `<li>${step}</li>`)
                .join("");
        }

        if (solutionExplanationEl && currentLab.solution.explanation) {
            solutionExplanationEl.innerHTML = currentLab.solution.explanation;
        }

        solutionModalOverlay.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }

    function closeSolutionModal() {
        if (!solutionModalOverlay) return;
        solutionModalOverlay.classList.add("hidden");
        document.body.style.overflow = "";
    }

    if (viewSolutionBtn) {
        viewSolutionBtn.addEventListener("click", openSolutionModal);
    }

    if (closeSolutionModalBtn) closeSolutionModalBtn.addEventListener("click", closeSolutionModal);
    if (dismissModalBtn) dismissModalBtn.addEventListener("click", closeSolutionModal);

    if (solutionModalOverlay) {
        solutionModalOverlay.addEventListener("click", (e) => {
            if (e.target === solutionModalOverlay) {
                closeSolutionModal();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && solutionModalOverlay && !solutionModalOverlay.classList.contains("hidden")) {
            closeSolutionModal();
        }
    });

    if (copyPayloadBtn) {
        copyPayloadBtn.addEventListener("click", async () => {
            if (!currentLab || !currentLab.solution) return;
            const payload = currentLab.solution.payload;
            try {
                await navigator.clipboard.writeText(payload);
                const originalText = copyPayloadBtn.innerHTML;
                copyPayloadBtn.innerHTML = `<span>✓</span> Copied!`;
                copyPayloadBtn.classList.add("copied");
                setTimeout(() => {
                    copyPayloadBtn.innerHTML = originalText;
                    copyPayloadBtn.classList.remove("copied");
                }, 2000);
            } catch (err) {
                const tempTextArea = document.createElement("textarea");
                tempTextArea.value = payload;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                document.execCommand("copy");
                document.body.removeChild(tempTextArea);
                copyPayloadBtn.innerHTML = `<span>✓</span> Copied!`;
                setTimeout(() => {
                    copyPayloadBtn.innerHTML = `<span>📋</span> Copy Payload`;
                }, 2000);
            }
        });
    }

    if (autofillBtn) {
        autofillBtn.addEventListener("click", () => {
            if (!currentLab || !currentLab.solution || !currentLab.solution.autofill) return;
            const autofillMap = currentLab.solution.autofill;
            for (const [id, val] of Object.entries(autofillMap)) {
                const el = document.getElementById(id);
                if (el) el.value = val;
            }
            closeSolutionModal();
            const practiceArea = document.querySelector(".target-box");
            if (practiceArea) {
                practiceArea.scrollIntoView({ behavior: "smooth", block: "center" });
                practiceArea.style.transition = "box-shadow 0.4s ease, border-color 0.4s ease";
                practiceArea.style.borderColor = "rgba(101, 212, 154, 0.6)";
                practiceArea.style.boxShadow = "0 0 30px rgba(101, 212, 154, 0.25)";
                setTimeout(() => {
                    practiceArea.style.borderColor = "";
                    practiceArea.style.boxShadow = "";
                }, 1800);
            }
        });
    }

});