const checklistData = [
  {
    category: "App Goals",
    items: [
      "Define the main business purpose of the mobile app.",
      "List the outcomes the app should create for users or customers.",
      "Identify how the app supports revenue, service, or operations.",
      "Decide which goals are required for the first launch."
    ]
  },
  {
    category: "Target Users",
    items: [
      "Identify the primary user groups for the app.",
      "Document the main tasks each user group needs to complete.",
      "List accessibility, language, or location needs.",
      "Decide whether users need accounts, profiles, or guest access."
    ]
  },
  {
    category: "Core Features",
    items: [
      "List the must-have features for the first app release.",
      "Separate launch features from later phase ideas.",
      "Identify features that need offline access or real-time updates.",
      "Document any features that depend on user permissions."
    ]
  },
  {
    category: "iOS and Android Planning",
    items: [
      "Decide whether the first release needs iOS, Android, or both.",
      "Identify device types and screen sizes to support.",
      "Document any platform-specific features or limitations.",
      "Decide whether a web app or admin portal is also needed."
    ]
  },
  {
    category: "User Experience and Design",
    items: [
      "Map the main screens users need to navigate.",
      "Define the key actions users should complete quickly.",
      "Document branding, visual style, and usability expectations.",
      "Identify onboarding, empty states, and error messages."
    ]
  },
  {
    category: "Backend and Admin Panel",
    items: [
      "List data the app needs to store on a server.",
      "Identify admin tools staff need to manage users or content.",
      "Document moderation, approval, or support workflows.",
      "Decide which app settings should be managed outside the app."
    ]
  },
  {
    category: "Payments and Subscriptions",
    items: [
      "Decide whether the app needs payments, subscriptions, or purchases.",
      "Identify pricing models, trial periods, or account tiers.",
      "Document refund, cancellation, and receipt requirements.",
      "Review platform rules for in-app purchases."
    ]
  },
  {
    category: "Notifications and Messaging",
    items: [
      "List push notifications users should receive.",
      "Identify email, SMS, or in-app message needs.",
      "Document notification preferences and opt-out requirements.",
      "Decide which events should trigger automated messages."
    ]
  },
  {
    category: "Security and User Data",
    items: [
      "Identify sensitive user data the app will collect.",
      "Decide whether two-factor authentication or social login is needed.",
      "Document privacy, consent, and data deletion requirements.",
      "Plan secure access for staff, admins, and app users."
    ]
  },
  {
    category: "Testing and Quality Assurance",
    items: [
      "List devices and operating system versions to test.",
      "Define important user flows that must be tested before launch.",
      "Identify edge cases, payment flows, and account recovery needs.",
      "Plan beta testing with real users or internal staff."
    ]
  },
  {
    category: "App Store Launch",
    items: [
      "Prepare app name, description, screenshots, and store assets.",
      "Document privacy policy, support URL, and app review details.",
      "Review app store rules for the planned features.",
      "Plan the launch date, announcement, and release checklist."
    ]
  },
  {
    category: "Post-Launch Support",
    items: [
      "Decide how users will report bugs or request help.",
      "Plan monitoring for crashes, performance, and usage metrics.",
      "Document who will manage updates after launch.",
      "List future improvements for later app versions."
    ]
  }
];

const STORAGE_KEY = "prologicaMobileAppLaunchChecklist";

const checklistEl = document.getElementById("checklist");
const progressPercentageEl = document.getElementById("progressPercentage");
const progressFillEl = document.getElementById("progressFill");
const readinessLevelEl = document.getElementById("readinessLevel");
const resetButton = document.getElementById("resetButton");

function getSavedState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getItemId(categoryIndex, itemIndex) {
  return `mobile-app-item-${categoryIndex}-${itemIndex}`;
}

function renderChecklist() {
  const savedState = getSavedState();

  checklistData.forEach((group, categoryIndex) => {
    const card = document.createElement("article");
    card.className = "category-card";

    const heading = document.createElement("h2");
    heading.textContent = group.category;

    const list = document.createElement("ul");
    list.className = "checklist-items";

    group.items.forEach((item, itemIndex) => {
      const itemId = getItemId(categoryIndex, itemIndex);
      const listItem = document.createElement("li");
      listItem.className = "checklist-item";

      const label = document.createElement("label");
      label.setAttribute("for", itemId);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = itemId;
      checkbox.checked = Boolean(savedState[itemId]);

      const labelText = document.createElement("span");
      labelText.textContent = item;

      label.append(checkbox, labelText);
      listItem.appendChild(label);
      list.appendChild(listItem);
    });

    card.append(heading, list);
    checklistEl.appendChild(card);
  });
}

function updateProgress() {
  const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
  const checkedCount = checkboxes.filter((checkbox) => checkbox.checked).length;
  const percentage = checkboxes.length ? Math.round((checkedCount / checkboxes.length) * 100) : 0;

  progressPercentageEl.textContent = `${percentage}%`;
  progressFillEl.style.width = `${percentage}%`;

  readinessLevelEl.classList.remove("readiness-low", "readiness-medium", "readiness-high");

  if (percentage < 40) {
    readinessLevelEl.textContent = "Early App Idea Stage";
    readinessLevelEl.classList.add("readiness-low");
  } else if (percentage < 70) {
    readinessLevelEl.textContent = "Needs More Launch Planning";
    readinessLevelEl.classList.add("readiness-medium");
  } else {
    readinessLevelEl.textContent = "Ready for Mobile App Discovery";
    readinessLevelEl.classList.add("readiness-high");
  }
}

function handleChecklistChange(event) {
  if (event.target.type !== "checkbox") {
    return;
  }

  const savedState = getSavedState();
  savedState[event.target.id] = event.target.checked;
  saveState(savedState);
  updateProgress();
}

function resetChecklist() {
  localStorage.removeItem(STORAGE_KEY);
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
  updateProgress();
}

renderChecklist();
updateProgress();

checklistEl.addEventListener("change", handleChecklistChange);
resetButton.addEventListener("click", resetChecklist);
