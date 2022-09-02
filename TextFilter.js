import React from 'react';
import Text from "react-native";
import {findAll} from 'highlight-words-core';
import PropTypes from "prop-types";

Highlighter.propTypes = {
    autoEscape: PropTypes.bool,
    highlightStyle: Text.propTypes.style,
    searchWords: PropTypes.arrayOf(PropTypes.string).isRequired,
    textToHighlight: PropTypes.string.isRequired,
    sanitize: PropTypes.func,
    style: Text.propTypes.style
};

function Highlighter({
    autoEscape,
    highlightStyle,
    searchWords,
    textToHighlight,
    sanitize,
    style,
    ...props
}) {
    const chunks = findAll({textToHighlight, searchWords, sanitize, autoEscape});

    return (
        <Text style={style} {...props}>
            {chunks.map((chunk, index) => {
                const text = textToHighlight.substr(chunk.start, chunk.end - chunk.start);

                return (!chunk.highlight)
                    ? text
                    : (
                        <Text
                            key={index}
                            style={chunk.highlight && highlightStyle}
                        >
                            {text}
                        </Text>
                    );
            })}
        </Text>
    );
}


//////end highlighter declaration

const filterText = ({data, searchKey, highlightColor, onSearch, searchText}) => {
    if (!searchText || !!onSearch) return data;

    const filteredData = [];
    for (const dt of data) {
        for (let s = 0; s < searchKey.length; s++) {
          sk = searchKey[s];
          const target = dt[sk];
          if (!target) continue;
  
          if (target.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
            if (!highlightColor) {
              filteredData.push(dt);
              break;
            }
            const row = {};
            row.cleanData = dt;
            const keys = Object.keys(dt);
            for (const key of keys) {
              if (typeof dt[key] === "string") {
                row[key] = (
                  <Highlighter
                    highlightStyle={{ backgroundColor: highlightColor }}
                    searchWords={[searchText.toLowerCase()]}
                    textToHighlight={dt[key]}
                  />
                );
              }
            }
            filteredData.push(row);
            break;
          }
        }
    }
    return filteredData;
};

export default filterText;