const categories = new Set([
  "Food",
  "Groceries",
  "Transport",
  "Shopping",
  "Bills",
  "Healthcare",
  "Education",
  "Other",
]);

function validateExpense(input, partial = false) {
  const errors = [];
  const value = {};

  if (!partial || input.merchant !== undefined) {
    if (typeof input.merchant !== "string" || input.merchant.trim().length === 0) {
      errors.push("merchant is required");
    } else if (input.merchant.trim().length > 120) {
      errors.push("merchant must be 120 characters or fewer");
    } else {
      value.merchant = input.merchant.trim();
    }
  }

  if (!partial || input.category !== undefined) {
    if (!categories.has(input.category)) errors.push("category is invalid");
    else value.category = input.category;
  }

  if (!partial || input.amount !== undefined) {
    const amount = Number(input.amount);
    if (!Number.isFinite(amount) || amount <= 0) errors.push("amount must be greater than 0");
    else value.amount = amount;
  }

  if (!partial || input.date !== undefined) {
    const date = input.date || input.spentOn;
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push("date must use YYYY-MM-DD format");
    else if (date) value.spentOn = date;
  }

  if (input.notes !== undefined) {
    if (input.notes !== null && typeof input.notes !== "string") errors.push("notes must be text");
    else value.notes = input.notes;
  }

  return { errors, value };
}

module.exports = { validateExpense };
