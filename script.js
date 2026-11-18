const teamMembers = [
  { name: "itshakemd", bio: "Bio", image: "", github: "", linkedin: "" },
  { name: "Yahia Abuawwad", bio: "Bio", image: "", github: "", linkedin: "" },
  { name: "Tala", bio: "Bio", image: "", github: "", linkedin: "" },
  { name: "Makel", bio: "Bio", image: "", github: "", linkedin: "" },
  { name: "Laith", bio: "Bio", image: "", github: "", linkedin: "" },
];

const memberButtons = document.querySelectorAll(".member-option");
const dropzone = document.querySelector("#member-dropzone");
const dropPrompt = document.querySelector("#drop-prompt");
const memberDetails = document.querySelector("#member-details");
const memberName = document.querySelector("#member-name");
const memberBio = document.querySelector("#member-bio");
const memberPhoto = document.querySelector("#member-photo");
const memberGithub = document.querySelector("#member-github");
const memberGithubPlaceholder = document.querySelector("#member-github-placeholder");
const memberLinkedin = document.querySelector("#member-linkedin");
const memberLinkedinPlaceholder = document.querySelector("#member-linkedin-placeholder");
const teamStatus = document.querySelector("#team-status");

if (
  dropzone
  && dropPrompt
  && memberDetails
  && memberName
  && memberBio
  && memberPhoto
  && memberGithub
  && memberGithubPlaceholder
  && memberLinkedin
  && memberLinkedinPlaceholder
  && teamStatus
) {
  const setAccount = (link, placeholder, url, label) => {
    if (url) {
      link.href = url;
      link.textContent = label;
      link.hidden = false;
      placeholder.hidden = true;
      return;
    }

    link.hidden = true;
    link.textContent = "";
    placeholder.hidden = false;
  };

  const showMember = (value) => {
    const index = Number(value);
    const member = Number.isInteger(index) ? teamMembers[index] : undefined;

    if (!member) {
      teamStatus.textContent = "Choose one of the listed team members.";
      return;
    }

    memberName.textContent = member.name;
    memberBio.textContent = member.bio;
    if (member.image) {
      memberPhoto.src = member.image;
      memberPhoto.hidden = false;
    } else {
      memberPhoto.removeAttribute("src");
      memberPhoto.hidden = true;
    }
    setAccount(memberGithub, memberGithubPlaceholder, member.github, "GitHub");
    setAccount(memberLinkedin, memberLinkedinPlaceholder, member.linkedin, "LinkedIn");
    dropPrompt.hidden = true;
    memberDetails.hidden = false;
    dropzone.classList.add("has-member");
    teamStatus.textContent = "";
    dropzone.classList.remove("is-over");
  };

  memberButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showMember(button.dataset.memberIndex);
    });

    button.addEventListener("dragstart", (event) => {
      event.dataTransfer?.setData("text/plain", button.dataset.memberIndex ?? "");
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "copy";
      }
    });
  });

  const isInsideDropzone = (event) => {
    const bounds = dropzone.getBoundingClientRect();
    return event.clientX >= bounds.left
      && event.clientX <= bounds.right
      && event.clientY >= bounds.top
      && event.clientY <= bounds.bottom;
  };

  document.addEventListener("dragover", (event) => {
    if (!isInsideDropzone(event)) {
      return;
    }

    event.preventDefault();
    dropzone.classList.add("is-over");
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  }, true);

  document.addEventListener("dragleave", (event) => {
    if (!isInsideDropzone(event)) {
      dropzone.classList.remove("is-over");
    }
  }, true);

  document.addEventListener("drop", (event) => {
    if (!isInsideDropzone(event)) {
      return;
    }

    event.preventDefault();
    showMember(event.dataTransfer?.getData("text/plain") ?? "");
  }, true);
}
