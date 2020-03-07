import React, { PropsWithChildren } from "react";
import { Info, Enrollment, Uniform, Member } from "state/models";
import { fullName } from "utils/helpers";

export interface FormInputType<T> {
  toString: (t: T) => string;
  fromString: (s: string) => T;
  textType: TextInputType;
}

export type TextInputType =
  | "text"
  | "number"
  | "tel"
  | "email"
  | "password"
  | "date"
  | "time";

export const stringType: FormInputType<string> = {
  toString: x => x,
  fromString: x => x,
  textType: "text"
};

export const dateType: FormInputType<string> = {
  toString: x => x,
  fromString: x => x,
  textType: "date"
};

export const timeType: FormInputType<string> = {
  toString: x => x,
  fromString: x => x,
  textType: "time"
};

export const emailType: FormInputType<string> = {
  toString: x => x,
  fromString: x => x,
  textType: "email"
};

export const passwordType: FormInputType<string> = {
  toString: x => x,
  fromString: x => x,
  textType: "password"
};

export const phoneType: FormInputType<string> = {
  toString: x => x,
  fromString: x => x,
  textType: "tel"
};

export const numberType: FormInputType<number | null> = {
  toString: x => (x ? `${x}` : ""),
  fromString: x => (parseInt(x) !== NaN ? parseInt(x) : null),
  textType: "number"
};

export const sectionType = (
  info: Info | null
): FormInputType<string | null> => ({
  toString: x => x || "No Section",
  fromString: x => (info?.sections || []).find(s => s === x) || null,
  textType: "text"
});

export const uniformType = (
  info: Info | null
): FormInputType<Uniform | null> => ({
  toString: u => u?.name || "(no uniform)",
  fromString: u =>
    (info?.uniforms || []).find(uniform => uniform.name === u) || null,
  textType: "text"
});

export const memberType = (
  members: Member[]
): FormInputType<Member | null> => ({
  toString: member => (member ? fullName(member) : "(nobody)"),
  fromString: name => members.find(m => fullName(m) === name) || null,
  textType: "text"
});

export const enrollmentType: FormInputType<Enrollment | null> = {
  toString: x => x || "Inactive",
  fromString: x => (x === "Class" || x === "Club" ? x : null),
  textType: "text"
};

export const Control: React.FC<{ expanded?: boolean }> = ({
  expanded,
  children
}) => (
  <p className={"control" + (expanded ? " is-expanded" : "")}>{children}</p>
);

export interface InputAttributes {
  title?: string;
  horizontal?: boolean;
  required?: boolean;
  helpText?: string;
  placeholder?: string;
  expanded?: boolean;
  loading?: boolean;
  prefix?: string;
  suffix?: string;
  autocomplete?: boolean;
}

export const InputWrapper: React.FC<InputAttributes> = props => (
  <div className={"field" + props.horizontal ? " is-horizontal" : ""}>
    {props.title &&
      (props.horizontal ? (
        <div className="field-label is-normal">
          <label className="label">{props.title}</label>
        </div>
      ) : (
        <label className="label">{props.title}</label>
      ))}
    {props.children}
    {props.helpText && <p className="help">{props.helpText}</p>}
  </div>
);

export const FieldWrapper: React.FC<InputAttributes> = props => {
  const classes = [
    "field",
    props.expanded ? "is-expanded" : null,
    props.loading ? "is-loading" : null,
    props.prefix || props.suffix ? "has-addons" : null
  ];

  return (
    <div className={classes.filter(c => !!c).join(" ")}>
      {props.prefix && (
        <Control>
          <a className="button is-static">{props.prefix}</a>
        </Control>
      )}
      {props.children}
      {props.suffix && (
        <Control>
          <a className="button is-static">{props.suffix}</a>
        </Control>
      )}
    </div>
  );
};

export interface TextInputProps<T> extends InputAttributes {
  value: T;
  type: FormInputType<T>;
  onInput: (t: T) => void;
}

export const TextInput = <T extends any>(
  props: PropsWithChildren<TextInputProps<T>>
) => (
  <InputWrapper {...props}>
    <FieldWrapper {...props}>
      <Control>
        <input
          className={"input" + (props.loading ? " is-loading" : "")}
          value={props.type.toString(props.value)}
          onChange={event =>
            props.onInput(props.type.fromString(event.target.value))
          }
          type={props.type.textType}
          placeholder={props.placeholder}
          required={props.required}
          autoComplete={props.autocomplete === false ? "off" : "on"}
        />
      </Control>
    </FieldWrapper>
  </InputWrapper>
);

export interface TextareaInputProps extends InputAttributes {
  value: string;
  onInput: (val: string) => void;
}

export const TextareaInput: React.FC<TextareaInputProps> = props => (
  <InputWrapper {...props}>
    <FieldWrapper {...props}>
      <Control>
        <textarea
          className={"textarea" + (props.loading ? " is-loading" : "")}
          value={props.value}
          onChange={event => props.onInput(event.target.value)}
          placeholder={props.placeholder}
          required={props.required}
          autoComplete={props.autocomplete === false ? "off" : "on"}
        />
      </Control>
    </FieldWrapper>
  </InputWrapper>
);

export interface SelectInputProps<T> extends InputAttributes {
  values: T[];
  selected: T;
  type: FormInputType<T>;
  onInput: (t: T) => void;
}

export const SelectInput = <T extends any>(
  props: PropsWithChildren<SelectInputProps<T>>
) => (
  <InputWrapper {...props}>
    <FieldWrapper {...props}>
      <div className={"select control" + (props.loading ? " is-loading" : "")}>
        <select
          onInput={event =>
            props.onInput(props.type.fromString(event.currentTarget.value))
          }
        >
          {props.values
            .map(val => props.type.toString(val))
            .map(value => (
              <option
                value={value}
                selected={value === props.type.toString(props.selected)}
              >
                {value}
              </option>
            ))}
        </select>
      </div>
    </FieldWrapper>
  </InputWrapper>
);

export interface RadioInputProps<T> extends InputAttributes {
  values: T[];
  selected: T;
  render: (t: T) => string;
  onInput: (t: T) => void;
}

export const RadioInput = <T extends any>(
  props: PropsWithChildren<RadioInputProps<T>>
) => (
  <InputWrapper {...props}>
    <FieldWrapper {...props}>
      {props.values.map((val, index) => (
        <>
          <label className="radio">
            <input
              type="radio"
              checked={`${val}` === `${props.selected}`}
              onClick={() => props.onInput(val)}
            />
            {" " + props.render(val)}
          </label>
          {index !== props.values.length - 1 && <br />}
        </>
      ))}
    </FieldWrapper>
  </InputWrapper>
);

export interface CheckboxInputProps {
  content: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  content,
  checked,
  onChange
}) => (
  <div className="control checkbox">
    <label className="checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(!checked)}
      />{" "}
      {content}
    </label>
  </div>
);

// type alias FileInput msg =
//     { file : Maybe File
//     , selectFile : Maybe File -> msg
//     , attrs : List FormAttribute
//     }

// filesDecoder : Decode.Decoder (Maybe File)
// filesDecoder =
//     Decode.at [ "target", "files" ]
//         (Decode.list File.decoder |> Decode.map List.head)

// fileInput : FileInput msg -> Html msg
// fileInput data =
//     let
//         uploadButton =
//             span [ class "file-cta" ]
//                 [ span [ class "file-icon" ]
//                     [ i [ class "fas fa-upload" ] [] ]
//                 , span [ class "file-label" ]
//                     [ text "Choose a file..." ]
//                 ]

//         inputElement =
//             input
//                 [ class "file-input"
//                 , type_ "file"
//                 , on "change" (Decode.map data.selectFile filesDecoder)
//                 ]
//                 []

//         maybeFileName =
//             data.file
//                 |> Maybe.map
//                     (\file ->
//                         span
//                             [ class "file-name" ]
//                             [ text (File.name file) ]
//                     )
//                 |> Maybe.withDefault (text "")
//     in
//     inputWrapper data.attrs <|
//         [ div [ class "file has-name" ]
//             [ label [ class "file-label" ]
//                 [ inputElement
//                 , uploadButton
//                 , maybeFileName
//                 ]
//             ]
//         ]
