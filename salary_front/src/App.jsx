import { useState, useEffect } from "react";

export default function App() {
  const [salary, setSalary] = useState(
    localStorage.getItem("salary") || ""
  );

  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem("sections");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: Date.now(),
            title: "Section 1",
            rows: [{ id: Date.now() + 1, label: "", amount: 0 }],
          },
        ];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("salary", salary);
    localStorage.setItem("sections", JSON.stringify(sections));
  }, [salary, sections]);

  // Handlers
  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now(),
        title: "New Section",
        rows: [{ id: Date.now() + 1, label: "", amount: 0 }],
      },
    ]);
  };

  const renameSection = (sectionIndex, newName) => {
    const copy = [...sections];
    copy[sectionIndex].title = newName;
    setSections(copy);
  };

  const addRow = (sectionId) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              rows: [
                ...s.rows,
                { id: Date.now(), label: "", amount: 0 },
              ],
            }
          : s
      )
    );
  };

  const updateRow = (secId, rowId, field, value) => {
    setSections(
      sections.map((s) =>
        s.id === secId
          ? {
              ...s,
              rows: s.rows.map((r) =>
                r.id === rowId ? { ...r, [field]: value } : r
              ),
            }
          : s
      )
    );
  };

  const removeRow = (secId, rowId) => {
    setSections(
      sections.map((s) =>
        s.id === secId
          ? { ...s, rows: s.rows.filter((r) => r.id !== rowId) }
          : s
      )
    );
  };

  const deleteSection = (secId) => {
    setSections(sections.filter((s) => s.id !== secId));
  };

  // Calculate totals
  const calcSectionTotal = (sec) =>
    sec.rows.reduce(
      (sum, r) => sum + (parseFloat(r.amount) || 0),
      0
    );

  const totalUsed = sections.reduce(
    (sum, sec) => sum + calcSectionTotal(sec),
    0
  );

  const grandRemaining =
    (parseFloat(salary) || 0) - totalUsed;

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      {/* MOBILE FIX CSS */}
      <style>
        {`
        @media (max-width: 600px) {
          .row {
            flex-direction: column;
            gap: 5px !important;
          }
          .amount-input {
            width: 100% !important;
          }
          .delete-btn {
            width: 100%;
            padding: 8px !important;
            text-align: center;
          }
          .section-box {
            padding: 12px !important;
          }
        }
      `}
      </style>

      <h1 style={{ fontSize: 26, fontWeight: "bold" }}>Salary Usage</h1>

      {/* Salary Input */}
      <div style={{ marginTop: 15 }}>
        <label style={{ fontWeight: "bold" }}>Salary:</label>
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            marginTop: 5,
            border: "2px solid #aaa",
            borderRadius: 8,
          }}
        />
      </div>
      {/* Final Remaining */}
      <h2 style={{ marginTop: 25, fontWeight: "bold" }}>
        Final Remaining: ₹{grandRemaining}
      </h2>

      {/* Sections */}
      {sections.map((sec, si) => {
        const sectionTotal = calcSectionTotal(sec);
        const remainingAfter =
          (parseFloat(salary) || 0) -
          sections
            .slice(0, si + 1)
            .reduce(
              (sum, s) => sum + calcSectionTotal(s),
              0
            );

        return (
          <div
            key={sec.id}
            tabIndex={0} 
            onKeyDown={(e) => {
              if(e.ctrlKey && e.key.toLowerCase() === "i"){
                e.preventDefault();
                addRow(sec.id);
              }
            }}
            className="section-box"
            style={{
              marginTop: 25,
              padding: 18,
              border: "3px solid #ccc",
              borderRadius: 12,
            }}
          >
            {/* Section Title */}
            <input
              value={sec.title}
              onChange={(e) =>
                renameSection(si, e.target.value)
              }
              style={{
                width: "100%",
                fontSize: 20,
                fontWeight: "bold",
                border: "none",
                marginBottom: 10,
              }}
            />

            {/* Rows */}
            {sec.rows.map((row) => (
              <div
                key={row.id}
                className="row"
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                <input
                  value={row.label}
                  onChange={(e) =>
                    updateRow(sec.id, row.id, "label", e.target.value)
                  }
                  placeholder="Label"
                  style={{
                    flex: 1,
                    padding: 8,
                    border: "1px solid #aaa",
                    borderRadius: 6,
                  }}
                />

                <input
                  type="number"
                  className="amount-input"
                  value={row.amount}
                  onChange={(e) =>
                    updateRow(sec.id, row.id, "amount", e.target.value)
                  }
                  placeholder="Amount"
                  style={{
                    width: 160,
                    padding: 8,
                    border: "1px solid #aaa",
                    borderRadius: 6,
                  }}
                />

                <button
                  className="delete-btn"
                  onClick={() => removeRow(sec.id, row.id)}
                  style={{
                    padding: "8px 12px",
                    background: "#ff5252",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  X
                </button>
              </div>
            ))}

            {/* Add Row */}
            <button
              onClick={() => addRow(sec.id)}
              style={{
                marginTop: 12,
                padding: "8px 12px",
                background: "#ddd",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              + Add Item
            </button>

            {/* Section Total */}
            <div style={{ marginTop: 15, fontWeight: "bold" }}>
              Section Total: ₹{sectionTotal}
            </div>

            {/* Remaining After Section */}
            <div style={{ marginTop: 5, color: "#555" }}>
              Remaining After This: ₹{remainingAfter}
            </div>

            {/* Delete Section */}
            <button
              onClick={() => deleteSection(sec.id)}
              style={{
                marginTop: 10,
                padding: 8,
                background: "#ff4444",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Delete Section
            </button>
          </div>
        );
      })}

      {/* Add Section */}
      <button
        onClick={addSection}
        style={{
          marginTop: 20,
          padding: 10,
          width: "100%",
          background: "#3a86ff",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        + Add Section
      </button>

      {/* Final Remaining
      <h2 style={{ marginTop: 25, fontWeight: "bold" }}>
        Final Remaining: ₹{grandRemaining}
      </h2> */}
    </div>
  );
}
