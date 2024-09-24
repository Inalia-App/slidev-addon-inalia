---
inalia:
  donut:
    cornerRadius: 0
    padAngle: 0
    arcWidth: 0
  bar:
    barWidth: 120
---

# Inalia

This is the subtitle

---

<!-- <Inalia :questionId="103487622" /> -->

---

<Inalia
  question="This is the question"
  type="text"
  :answers="['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4']"
/>

---

<Inalia
  question="This is the question"
  type="single_select"
  chart="donut"
  :answers="[{ label: 'Answer 1', value: 3 }, { label: 'Answer 2', value: 4 }, { label: 'Answer 3', value: 5 }, { label: 'Answer 4', value: 6 }]"
/>

---
inalia:
  bar:
    barWidth: 30
---

<Inalia
  question="Connaissez-vous UnJS ?"
  type="single_select"
  chart="bar"
  :answers="[
    { label: 'Je l\'utilise régulièrement', value: 0, color: '#4ade80' },
    { label: 'Oui mais de nom', value: 5, color: '#16a34a' },
    { label: 'Non', value: 20, color: '#166534' }
  ]"
/>
