"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useState } from "react";

function SSRQueryClientProvider({ children }: PropsWithChildren) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          refetchOnMount: true,
          refetchOnReconnect: false,
          retry: 3,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <div
        style={{
          fontSize: "16px",
        }}
      >
        <ReactQueryDevtools
          styleNonce=""
          initialIsOpen={process.env.NEXT_PUBLIC_MODE === "local"}
        />
      </div>
    </QueryClientProvider>
  );
}

export default SSRQueryClientProvider;
