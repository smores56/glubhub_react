import React, { useContext } from "react";
import {
  Section,
  Container,
  Box,
  EmailLink,
  PhoneLink
} from "components/Basics";
import { Member } from "state/models";
import { fullName } from "utils/helpers";
import { GlubHubContext } from "utils/context";

export const Roster: React.FC = () => {
  const { members } = useContext(GlubHubContext);

  const memberRow = (member: Member) => (
    <tr>
      <td>
        <a href={"/profile/" + member.email}>{fullName(member)}</a>
      </td>
      <td>{member.section || "Homeless"}</td>
      <td>
        <EmailLink email={member.email} />
      </td>
      <td>
        <PhoneLink phone={member.phoneNumber} />
      </td>
      <td>{member.location}</td>
    </tr>
  );

  return (
    <Section>
      <Container>
        <Box>
          <table className="table is-fullwidth">
            <thead>
              <tr>
                <th>Name</th>
                <th>Section</th>
                <th>E-mail</th>
                <th>Phone</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>{members.map(memberRow)}</tbody>
          </table>
        </Box>
      </Container>
    </Section>
  );
};