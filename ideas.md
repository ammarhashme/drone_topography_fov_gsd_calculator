# FOV & GSD Altitude Calculator - Design Brainstorm

## Design Philosophy Selection

After considering the technical and professional nature of this surveying calculator, I have chosen the **Precision Engineering** aesthetic—a modern, data-driven design that emphasizes clarity, accuracy, and professional credibility.

---

## Selected Design Approach: Precision Engineering

### Design Movement
**Modern Technical Minimalism** inspired by professional surveying software, engineering dashboards, and scientific instruments. The aesthetic balances technical sophistication with accessibility, drawing from precision instrument design principles.

### Core Principles
1. **Clarity Through Constraint**: Every visual element serves a purpose. Remove decorative noise; emphasize data hierarchy and calculation flow.
2. **Precision Visualization**: Use grid systems, exact typography scales, and deliberate spacing to convey accuracy and professionalism.
3. **Functional Hierarchy**: Guide users through the calculation workflow with visual weight and spatial organization, not decorative flourishes.
4. **Technical Credibility**: Employ design patterns from professional surveying and mapping software to build trust with domain experts.

### Color Philosophy
- **Primary**: Deep slate blue (`#1e3a5f`) — conveys precision, trust, and technical authority
- **Accent**: Vibrant cyan (`#00d4ff`) — highlights critical inputs and results, signals actionable data
- **Secondary**: Warm gray (`#f5f7fa`) — clean backgrounds that reduce cognitive load
- **Text**: Dark charcoal (`#1a1a1a`) on light, white on dark — maximum readability for technical data
- **Semantic**: Green for valid results, amber for warnings, red for constraint violations

**Reasoning**: The palette mirrors professional GIS and surveying tools, establishing immediate credibility with the target audience (surveyors, drone operators, geospatial engineers).

### Layout Paradigm
**Asymmetric Two-Column Layout**:
- **Left Column (40%)**: Input controls organized in collapsible sections (Sensor Specs, Flight Parameters, Overlap Requirements). Vertical flow emphasizes sequential input.
- **Right Column (60%)**: Real-time calculation results, visual feedback, and constraint validation. Larger space for data display reflects the importance of outputs.
- **Sticky Header**: Navigation and title remain fixed; content scrolls beneath.
- **Responsive Collapse**: On mobile, columns stack vertically with input above results.

### Signature Elements
1. **Precision Grid Background**: Subtle dot-grid pattern (opacity 3%) in the secondary column to evoke technical blueprints and surveying maps.
2. **Data Cards with Accent Borders**: Results displayed in cards with a left border in the accent color, mimicking technical documentation formatting.
3. **Constraint Indicator Badges**: Small, inline badges (✓ Valid / ⚠ Warning / ✗ Invalid) next to critical parameters, providing instant feedback.

### Interaction Philosophy
- **Real-Time Validation**: As users input values, constraints are checked and feedback appears instantly (no "Submit" button required).
- **Smooth Transitions**: Subtle fade-ins and slide-ups for results and warnings, conveying responsiveness without distraction.
- **Hover States**: Input fields and result cards have understated hover effects (slight background shift, border highlight) to signal interactivity.
- **Tooltips on Demand**: Technical definitions and formulas available via small info icons, keeping the interface clean while supporting learning.

### Animation
- **Input Feedback**: When a field is updated, the result cards fade in with a 200ms ease-out transition. Invalid states shake slightly (50ms) to draw attention.
- **Constraint Violations**: Amber warning badges slide in from the left with a subtle bounce (300ms) to alert without alarming.
- **Hover Lift**: Result cards and input groups lift slightly on hover (2px shadow increase) to indicate interactivity.
- **Loading States**: Calculation spinner uses a smooth 2-second rotation with a technical aesthetic (thin stroke, monochromatic).

### Typography System
- **Display Font**: IBM Plex Sans (bold, 700 weight) for titles and key metrics — conveys technical precision and authority.
- **Body Font**: IBM Plex Sans (regular, 400 weight) for descriptions and input labels — professional and highly readable.
- **Monospace Font**: IBM Plex Mono for calculated values and technical parameters — reinforces data precision.
- **Hierarchy**:
  - **H1**: 32px, 700 weight, slate blue — page title
  - **H2**: 20px, 600 weight, slate blue — section headers
  - **Body**: 14px, 400 weight, charcoal — descriptions and labels
  - **Data Values**: 18px, 600 weight, monospace, cyan — calculated results
  - **Captions**: 12px, 400 weight, gray — units and secondary info

---

## Implementation Checklist
- [ ] Implement two-column layout with responsive collapse
- [ ] Set up color tokens in Tailwind (slate blue, cyan, warm gray)
- [ ] Create input card components with validation feedback
- [ ] Build result cards with accent borders and constraint badges
- [ ] Add tooltip system for technical definitions
- [ ] Implement real-time calculation engine
- [ ] Add grid background pattern to results column
- [ ] Implement smooth transitions and hover effects
- [ ] Test mobile responsiveness
