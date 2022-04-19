import { AnalyzedQueriesDTOs } from "./dto/AnalyzedQueryDTO.js";
import { CreateQueryDTO } from "./dto/CreateQueryDTO.js";
import { QueryCreatedDTO } from "./dto/QueryCreatedDTO.js";
import fetch from "node-fetch";
import EventSource from "eventsource";

export class BackendUtils {
  private backendPath: string;

  constructor(backendPath: string) {
    this.backendPath = backendPath;
  }

  async requestQuery(config: CreateQueryDTO): Promise<QueryCreatedDTO> {
    const response = await fetch(`${this.backendPath}/query`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });

    if (response.ok) {
      const data = (await response.json()) as QueryCreatedDTO;
      return data;
    }

    throw new Error("Error in Backend");
  }

  getQueryStream(
    queryId: string,
    updateCallback: (data: AnalyzedQueriesDTOs.AnalyzedQuery) => void,
    completeCallback: (data: AnalyzedQueriesDTOs.AnalyzedQuery) => void
  ): EventSource {
    const source = new EventSource(`${this.backendPath}/query/${queryId}/sse`);

    source.onmessage = (messageEvent) => {
      const data: AnalyzedQueriesDTOs.AnalyzedQuery = JSON.parse(
        messageEvent.data
      );

      if (data.complete) {
        source.close();
        completeCallback(data);
        return;
      }

      updateCallback(data);
    };

    source.onerror = (event) => {
      console.log(event);
    };

    return source;
  }
}
