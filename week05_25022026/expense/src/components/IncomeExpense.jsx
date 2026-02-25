function IncomeExpense({ transactions }) {
  const amounts = transactions.map((t) => t.amount);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => acc + item, 0);

  const expense = amounts
    .filter((item) => item < 0)
    .reduce((acc, item) => acc + item, 0);

  return (
    <div className="inc-exp-container">
      <div>
        <h4>Income</h4>
        <p className="money plus">₹ {income.toFixed(2)}</p>
      </div>
      <div>
        <h4>Expense</h4>
        <p className="money minus">₹ {Math.abs(expense).toFixed(2)}</p>
      </div>
    </div>
  );
}

export default IncomeExpense;