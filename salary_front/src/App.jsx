import React, { useState, useEffect } from "react";

export default function App() {
  const [salary, setSalary] = useState(() => {
    const saved = localStorage.getItem("salary");
    return saved ? Number(saved) : "";
  });
  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem("sections");
    return saved ? JSON.parse(saved) : [
      {
        id: Date.now(),
        title: "",
        rows: [{ id: Date.now() + 1, label: "", amount: 0 }],
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("salary", salary);
  }, [salary]);

  useEffect(() => {
    localStorage.setItem("sections", JSON.stringify(sections));
  }, [sections]);
  

  // Add section
  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now(),
        title: "",
        rows: [{ id: Date.now(), label: "", amount: 0 }],
      },
    ]);
  };

  // Add row
  const addRow = (sectionId) => {
    setSections(
      sections.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              rows: [
                ...sec.rows,
                { id: Date.now(), label: "", amount: 0 },
              ],
            }
          : sec
      )
    );
  };

  // Update row
  const updateRow = (sectionId, rowId, key, value) => {
    setSections(
      sections.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              rows: sec.rows.map((r) =>
                r.id === rowId ? { ...r, [key]: value } : r
              ),
            }
          : sec
      )
    );
  };

  // Remove a row
  const removeRow = (sectionId, rowId) => {
    setSections(
      sections.map((sec) =>
        sec.id === sectionId
          ? { ...sec, rows: sec.rows.filter((r) => r.id !== rowId) }
          : sec
      )
    );
  };

  // Remove a section
  const removeSection = (sectionId) => {
    setSections(sections.filter((sec) => sec.id !== sectionId));
  };

  // Calculations
  const sectionTotal = (sec) =>
    sec.rows.reduce((t, r) => t + Number(r.amount || 0), 0);

  const grandUsed = sections.reduce((sum, s) => sum + sectionTotal(s), 0);
  const grandRemaining = salary - grandUsed;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h1>Salary Splitter</h1>

      {/* Salary Input */}
      <input
        type="number"
        placeholder="Enter Salary"
        value={salary}
        onChange={(e) => setSalary(Number(e.target.value))}
        style={{ padding: 10, marginBottom: 20, width: "100%", borderRadius: 5, border: "1px solid #ccc" }}
      />

      {/* Salary Summary */}
      <div style={{ marginBottom: 30, padding: 10, background: "#eee", borderRadius: 10}}>
        <p><b>Total Salary:</b> ₹{salary}</p>
        <p><b>Total Used:</b> ₹{grandUsed}</p>
        <p><b>Grand Remaining:</b> ₹{grandRemaining}</p>
      </div>

      {/* Sections */}
      {sections.map((sec) => {
        const total = sectionTotal(sec);
        const index = sections.findIndex(s => s.id === sec.id);
        const usedBefore = sections
          .slice(0, index)
          .reduce((sum, s) => sum + sectionTotal(s), 0);

        const remaining = salary - (usedBefore + total);

        return (
          <div key={sec.id} style={{ marginBottom: 25, padding: 15, border: "3px solid #ccc", borderRadius: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
              <input
                type="text"
                value={sec.title}
                onChange={(e) =>
                  setSections(
                    sections.map((s) =>
                      s.id === sec.id ? { ...s, title: e.target.value } : s
                    )
                  )
                }
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  width: "70%",
                  color: "Highlight",
                }}
              />
              <button onClick={() => removeSection(sec.id)} className="border rounded bg-red-500 p-2">Delete Section</button>
            </div>
            <hr />
            {/* Rows */}
            {sec.rows.map((row) => (
              <div key={row.id} style={{ display: "flex", gap: 10, marginBottom: 10, marginTop: 10 }}>
                <input
                  type="text"
                  placeholder="Label"
                  value={row.label}
                  onChange={(e) =>
                    updateRow(sec.id, row.id, "label", e.target.value)
                  }
                  style={{ flex: 1, textAlign: "center", border: "1px solid black", borderRadius: 5, padding: 5 }}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={row.amount}
                  onChange={(e) =>
                    updateRow(sec.id, row.id, "amount", e.target.value)
                  }
                  style={{ width: 220, textAlign: "center", border: "1px solid black", borderRadius: 5, padding: 5 }}
                />
                <button onClick={() => removeRow(sec.id, row.id)} style={{border: "3px solid black", padding: 5, fontWeight:"bolder", borderRadius:5, backgroundColor:"red"}}>X</button>
              </div>
            ))}

            <button onClick={() => addRow(sec.id)} style={{backgroundColor: "yellowgreen", padding: 5, borderRadius: 5}}>+ Add Row </button>

            {/* Section Calculation */}
            <div style={{ marginTop: 15, background: "#f4f4f4", padding: 10, borderRadius: 10 }}>
              <p><b>Section Total:</b> ₹{total}</p>
              <p><b>Remaining After This Section:</b> ₹{remaining}</p>
            </div>
          </div>
        );
      })}

      <button onClick={addSection} style={{ background: "gold", padding: 10, fontSize:"1.2rem"}}>+ Add Section</button>
    </div>
  );
}
