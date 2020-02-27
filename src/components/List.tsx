import React, { PropsWithChildren } from "react";
import { RemoteData } from "../utils/state";
import { NarrowColumn, Box, RemoteContent, Title } from "./Basics";
import { GOLD_COLOR } from "../utils/constants";

interface SelectableListProps<T> {
  listItems: RemoteData<T[][]>;
  render: (data: T) => JSX.Element;
  onSelect: (data: T) => void;
  isSelected: (data: T) => boolean;
  messageIfEmpty: string;
  title?: string;
  contentAtTop?: JSX.Element;
  contentAtBottom?: JSX.Element;
}

export const SelectableList = <T extends any>(
  props: PropsWithChildren<SelectableListProps<T>>
) => (
  <NarrowColumn>
    {props.title && <Title>{props.title}</Title>}
    <Box>
      {props.contentAtTop}
      <RemoteContent
        data={props.listItems}
        render={groups => {
          const nonEmptyGroups = groups.filter(group => group.length);

          if (nonEmptyGroups.length === 0) {
            return <p>{props.messageIfEmpty}</p>;
          }

          return (
            <div>
              <table className="table is-fullwidth is-hoverable no-bottom-border">
                <thead />
                <tbody>
                  {nonEmptyGroups
                    .map((group, index) => [
                      ...group.map(item => singleRow(item, props)),
                      index === nonEmptyGroups.length - 1 ? (
                        <></>
                      ) : (
                        <DividerRow />
                      )
                    ])
                    .flatMap(group => group)}
                </tbody>
              </table>
            </div>
          );
        }}
      />
      {props.contentAtBottom}
    </Box>
  </NarrowColumn>
);

const singleRow = <T extends any>(
  item: T,
  props: PropsWithChildren<SelectableListProps<T>>
) => (
  <tr
    style={{
      backgroundColor: props.isSelected(item) ? GOLD_COLOR : ""
    }}
    onClick={() => props.onSelect(item)}
  >
    {props.render(item)}
  </tr>
);

const DividerRow: React.FC = () => (
  <tr className="not-hoverable">
    <div className="is-divider" style={{ margin: "1rem" }} />
  </tr>
);
