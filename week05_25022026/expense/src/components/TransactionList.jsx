import TransactionItem from "./TransactionItem";

function TransactionList({ transactions, deleteTransaction }) {
  return (
    <div>
      <h3>History</h3>
      <ul className="list">
        {transactions.map((t) => (
          <TransactionItem
            key={t.id}
            transaction={t}
            deleteTransaction={deleteTransaction}
          />
        ))}
      </ul>
    </div>
  );
}

export default TransactionList;