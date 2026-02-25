function Balance({ transactions }) {
  const amounts = transactions.map((t) => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0);

  return (
    <div className="balance">
      <h3>Your Balance</h3>
      <h2>₹ {total.toFixed(2)}</h2>
    </div>
  );
}

export default Balance;