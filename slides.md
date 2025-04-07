---
# inalia:
#   donut:
#     cornerRadius: 0
#     padAngle: 0
#     arcWidth: 0
#   bar:
#     barWidth: 120
---

# Inalia

This is the subtitle

---
layout: inalia-overview
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
  :data="[
    { label:'Answer 1',count:3 },
    { label:'Answer 2',count:4 },
    { label:'Answer 3',count:5 },
    { label:'Answer 4',count:6 }
  ]"
/>

---

<Inalia
  question="question"
  type="multiple_select"
  chart="donut"
  :data="[
    { label: 'text', count: 2, color: '#000000' }, { label: 'coucou', count: 2, color: '#FF0000' }
  ]"
/>

---
inalia:
  bar:
    barWidth: 30
---

<Inalia
  :questionId="4"
/>

---
layout: inalia-feedback
---
