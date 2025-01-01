// @ts-check
import { getUser, getUserResults } from "../../scripts/firebase.js";

/**
 * @typedef {object} Result
 * @property {string} name
 * @property {number} score
 * @property {number} total
 * @property {string} duration
 * @property {string} course
 */

await new Promise((res) => {
  window.onload = () => res(true);
});

const performanceTableContainer = document.getElementById("performance-table");
const url = new URL(location.href);
const needs = ["score", "total", "duration", "course"];
const params = Array.from(url.searchParams.keys());
const missing = needs.filter((key) => {
  return !params.includes(key);
});
if (missing.length) {
  alert(`Search params are missing the following keys: ${missing.join(", ")}`);
  throw history.back();
}

/** @type {Record<keyof Omit<Result, "name">, string>} */
// @ts-ignore
const result = Object.fromEntries(Array.from(url.searchParams.entries()));

const average = ((+result.score / +result.total) * 100).toFixed();

const user = await getUser();

// @ts-ignore
performanceTableContainer.innerHTML = `
<h4 className="font-afacad text-[48px] font-bold leading-[35px] tracking-[-0.03em] text-left  text-primary">
  ${user.displayName}
</h4>
<table id="performance">
  <tbody>
    <tr>
      <td>Your score</td>
      <td>
        ${result.score}/${result.total}
      </td>
    </tr>
    <tr>
      <td>Your average</td>
      <td>${average}%</td>
    </tr>
    <tr>
      <td>Duration</td>
      <td>${result.duration}</td>
    </tr>
    <tr>
      <td>Course</td>
      <td>${result.course}</td>
    </tr>
    <tr>
      <td>Questions</td>
      <td>${result.total}</td>
    </tr>
  </tbody>
</table>
<div className="space-x-[15px]">
  <span className="font-afacad font-semibold text-[24px] leading-[32px] text-primary">
    Quiz Evaluation:
  </span>
  <span className="font-afacad font-medium text-[24px] leading-[32px] tracking-[-0.02em] text-white">
    Attempted: ${result.total}
  </span>
  <span className="font-afacad font-medium text-[24px] leading-[32px] tracking-[-0.02em] text-white">
    Passed: ${result.score}
  </span>
  <span className="font-afacad font-medium text-[24px] leading-[32px] tracking-[-0.02em] text-white">
    Failed: ${+result.total - +result.score}
  </span>
</div>
`;

/**
 * @typedef {object} StatCardProps
 * @property {string} title
 * @property {string} content
 * @property {number=} value
 * @property {number=} max
 * @param {StatCardProps} data
 */
function startCard(data) {
  const id = Math.random();
  queueMicrotask(() => {
    if (!data.max || !data.value) return;
    const canvas = document.getElementById(id.toString());
    // @ts-ignore
    new Chart(canvas, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [data.value, data.max - data.value],
            backgroundColor: ["#FF9500", "#141617"],
            hoverOffset: 4,
            borderWidth: 0,
            borderColor: "transparent",
          },
        ],
      },
    });
  });
  return `
    <div className="size-[251px] box-border flex items-center justify-center p-[21px_15px] gap-[32px] bg-[#1D1F21] xl:bg-transparent rounded-[20px] relative">
      <span className="absolute font-afacad font-semibold text-[24px] leading-[32px] text-white top-3 left-0 right-0 w-full text-center inline-block">
        ${data.title}
      </span>
      <div className="size-[125px] relative before:content-[''] before:size-full before:bg-black before:opacity-30 before:border-[2px_solid_black] before:rounded-full before:absolute before:-z-10 z-0 font-afacad text-semibold text-white flex justify-center items-center">
        <canvas id="${id}" className="-mt-2.5" />
        <span className="absolute capitalize text-lg">${data.content}</span>
      </div>
    </div>
    `;
}

const startCardContainer = document.getElementById("stat-cards");
// @ts-ignore
startCardContainer.innerHTML += [
  startCard({
    content: `${average}%`,
    title: "Average",
    max: 100,
    value: +average,
  }),
  startCard({
    content: `${result.score}/${result.total}`,
    title: "Score",
    max: +result.total,
    value: +result.score,
  }),
  startCard({
    content: result.duration,
    title: "Duration",
  }),
].join(" ");

const results = await getUserResults();
const rows = results.map((result) => {
  /** @type {string} */
  let className,
    /** @type {string} */
    text;
  if (+average >= 80) {
    className = "text-[#05C612]";
    text = "Great";
  } else if (+average >= 50) {
    className = "text-[#EFE009]";
    text = "Good";
  } else {
    className = "text-[#C61805]";
    text = "Poor";
  }
  return `
  <span>
    <!-- {record.date.getFullYear().toString().slice(2)}/
    {(record.date.getMonth() + 1).toString().padStart(2, "0")}/
    {record.date.getDate().toString().padStart(2, "0")} -->
    Unknown
  </span>
  <span>${result.course}</span>
  <span>${result.score}/${result.total}</span>
  {/* FIXME */}
  <span class="${className}">
    ${text}
  </span>
`;
});

const historyFieldContainer = document.getElementById("history-fields");
// @ts-ignore
historyFieldContainer.innerHTML = rows.join(" ");