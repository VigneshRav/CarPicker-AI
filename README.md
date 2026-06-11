# CarCompass AI — Smart Vehicle Matchmaker

**CarCompass AI** is an intelligent vehicle recommendation and decision-support tool tailored for the Indian car market. It simplifies the purchasing journey by translating a buyer’s budget, lifestyle needs, safety concerns, and mileage priorities into structured, side-by-side vehicle comparisons with transparent, AI-driven match ratings.

---

## 1. What was built and why?

### What was built
- An interactive, responsive **Preference Intake Form** capturing budget limits, seating needs, fuel engine preferences, safety priorities, efficiency weights, and primary usage profiles (e.g., daily commutes vs. off-roading).
- A matching engine backend that processes these variables using a weighted suitability algorithm to deliver the top 3 best-fit models.
- An interactive **Side-by-Side Specs & Trade-off Comparison Matrix** on the results page, highlighting the "Winner" for key specifications (Price, Safety rating, Mileage/Efficiency) and detailing how each vehicle aligns with the user's specific request.

### Why it was built
Car buying is a highly complex financial and personal decision. Standard automotive listing platforms inundate users with dry, static specification sheets, leaving buyers to perform mental gymnastics to compare options. CarCompass AI bridges this gap by:
1. **Contextualizing match percentages** with clear, natural language explanations.
2. **Exposing direct trade-offs** (e.g., showing if choosing a model saves ₹6.5 Lakhs under budget or offers extra seating room).
3. **Fostering trust** by breaking down matches objectively against the user's exact preferences.

---

## 2. What was deliberately cut?

- **Custom Multi-Car Selector**: Rather than building manual checkbox selectors where users have to select which cars to compare (adding cognitive load), the app automatically populates the comparison matrix with the top 3 recommendations.
- **Scraper-Based Live Pricing**: Integrated a high-fidelity static JSON catalog of the most popular Indian car models rather than live scraping, which ensured consistent match reliability and sub-second matching speeds.
- **Image/Media Gallery**: Focused on clean SVG/vector representations (`lucide-react`) and structured specifications to keep the UI lightweight, fast, and free of broken media layouts.

---

## 3. Tech Stack and Rationale

- **Frontend**: React (Vite) + Tailwind CSS + Lucide Icons. React provides a modern component-driven system, and Vite ensures near-instant hot module replacement (HMR) and fast build packaging. Tailwind CSS was chosen for its atomic utility system, enabling high-performance custom glassmorphism styling and seamless responsive layouts.
- **Backend**: Node.js + Express. Simple, non-blocking asynchronous event loop suited for serving data models and scoring recommendations instantly without heavy framework boilerplate.
- **Styling & Icons**: Tailwind + Lucide React. Lucide was selected for high-fidelity vector icons matching modern dashboard aesthetics.

---

## 4. What was delegated to AI tools?
- **Boilerplate CSS/Tailwind Generation**: Constructing layout skeletons, glassmorphic card styles, and form element styles.
- **Scaffold Setup**: The initial template for React components and basic Express routing structures.
- **Documentation Drafts**: Generating structured summaries of code implementations.

---

## 5. What was implemented manually?
- **Comparison Winner Calculations**: Writing the math to dynamically determine lowest price, safety leaders, and normalized efficiency leaders across different engine classes (EV vs. ICE).
- **Preference-to-Spec Alignment Engine**: Mapping the delta between search preferences and actual vehicle metrics (e.g. showing "₹X Lakhs under budget" or seating suitability text).
- **Syntax and Build Diagnostics**: Fixing nested JSX tags in `CarCard.jsx` and identifying/correcting invalid/non-existent package exports in third-party icon libraries.

---

## 6. Where AI helped most?
- **UI Design Speed**: Accelerating frontend development by generating Tailwind layout frameworks in seconds.
- **Structured JSON Handling**: Generating boilerplate mapping loops for dataset variables.

---

## 7. Where AI struggled?
- **Version Compatibility**: AI models frequently struggle with version-specific library changes (e.g., trying to import `Milestones` from `lucide-react` which did not exist, causing build errors).
- **JSX Tag Balancing**: The template initially shipped with unmatched HTML tags in grid wrappers, which had to be manually diagnosed and resolved.

---

## 8. If given 4 more hours, what would be added?

1. **Inline Weight Tuning**: A slide-out drawer on the results page enabling users to tweak safety or mileage priorities and see the comparison matrix update instantly via WebSocket or state updates without resetting.
2. **Total Cost of Ownership (TCO) Calculator**: A 5-year running cost projection comparing ICE fuel costs vs. EV charging expenses, based on average daily commute distance and regional energy/fuel rates.
3. **Interactive Comparison Highlights**: Toggle switches to "Show only differences" or "Highlight best spec" to let users collapse matching rows and focus exclusively on contrast details.
