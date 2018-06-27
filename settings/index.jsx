console.log("Settings Started")

function Card(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Costa Card</Text>}>
        <TextInput
          settingsKey="cardno"
          label="Card No."
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(Card);