'use client';

import getTransactions from '@/actions/get-transactions';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import currency from 'currency.js';
import { useCallback, useEffect, useState } from 'react';

type Row = GridRowModel<{
  id: string;
  date?: Date;
  description: string;
  category?: string;
  amount: number;
}>;

const COLUMNS: GridColDef<Row>[] = [
  {
    type: 'dateTime',
    field: 'date',
    headerName: 'Date',
  },
  {
    type: 'string',
    field: 'description',
    headerName: 'Description',
  },
  {
    type: 'string',
    field: 'category',
    headerName: 'Category',
  },
  {
    type: 'number',
    field: 'amount',
    headerName: 'Amount',
    valueFormatter: (params) => currency(params.value).format(),
  },
];

export default function TransactionsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [fetching, setFetching] = useState(false);

  const fetchRows = useCallback(async () => {
    setFetching(true);

    await getTransactions()
      .then((transactions) => {
        setRows(
          transactions.map((transaction) => ({
            id: transaction.transactionId,
            date:
              transaction.authorizedDatetime ??
              (transaction.authorizedDate
                ? new Date(transaction.authorizedDate)
                : undefined) ??
              undefined,
            description: transaction.merchantName ?? 'test',
            amount: transaction.amount,
          })),
        );
      })
      .finally(() => setFetching(false));
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  return (
    <Container maxWidth='lg' sx={{ m: '0 auto' }}>
      <Stack>
        <DataGrid autoHeight columns={COLUMNS} loading={fetching} rows={rows} />
      </Stack>
    </Container>
  );
}
