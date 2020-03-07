import React, { useContext } from "react";
import { loaded } from "state/types";
import { SelectableList } from "components/List";
import { visibleAdminTabs } from "utils/helpers";
import { AdminRoute, routeAdmin } from "state/route";
import { GlubHubContext, useGlubRoute } from "utils/context";
import { Section, Container, Columns, Box } from "components/Basics";

export const Admin: React.FC<{ tab: AdminRoute | null }> = ({ tab }) => {
  const { goToRoute } = useGlubRoute();
  const { user } = useContext(GlubHubContext);

  return (
    <Section>
      <Container>
        <Columns>
          <SelectableList
            listItems={loaded(user ? visibleAdminTabs(user) : [])}
            isSelected={t => t.route === tab?.route}
            messageIfEmpty="You have no officer permissions. Perish."
            onSelect={t => goToRoute(routeAdmin(t))}
            render={t => <td>{t.name}</td>}
          />
          {tab ? (
            <TabContent tab={tab} />
          ) : (
            <Box>Please select a menu item</Box>
          )}
        </Columns>
      </Container>
    </Section>
  );
};

// tabContent : FullAdminTab -> Html Msg
// tabContent tab =
//     case tab of
//         FullAdminCreateEvent tabModel ->
//             CreateEvent.view tabModel |> Html.map CreateEventMsg

//         FullAdminGigRequests tabModel ->
//             GigRequests.view tabModel |> Html.map GigRequestsMsg

//         FullAdminAbsenceRequests tabModel ->
//             AbsenceRequests.view tabModel |> Html.map AbsenceRequestsMsg

//         FullAdminEditSemester tabModel ->
//             EditSemester.view tabModel |> Html.map EditSemesterMsg

//         FullAdminOfficerPositions tabModel ->
//             OfficerPositions.view tabModel |> Html.map OfficerPositionsMsg

//         FullAdminSitePermissions tabModel ->
//             SitePermissions.view tabModel |> Html.map SitePermissionsMsg

//         FullAdminUniforms tabModel ->
//             Uniforms.view tabModel |> Html.map UniformsMsg

//         FullAdminDues tabModel ->
//             Dues.view tabModel |> Html.map DuesMsg

//         FullAdminDocumentLinks tabModel ->
//             DocumentLinks.view tabModel |> Html.map DocumentLinksMsg

//         FullAdminWebmasterTools tabModel ->
//             WebmasterTools.view tabModel |> Html.map WebmasterToolsMsg
