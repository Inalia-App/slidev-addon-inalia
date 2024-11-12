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
  :questionId="1"
/>

---

<Inalia
  question="This is the question"
  type="single_select"
  chart="donut"
  :data="[{ label: 'Answer 1', count: 3 }, { label: 'Answer 2', count: 4 }, { label: 'Answer 3', count: 5 }, { label: 'Answer 4', count: 6 }]"
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
  :data="[
    { label: 'Je l\'utilise régulièrement', count: 0, color: '#4ade80' },
    { label: 'Oui mais de nom', count: 5, color: '#16a34a' },
    { label: 'Non', count: 20, color: '#166534' }
  ]"
/>
