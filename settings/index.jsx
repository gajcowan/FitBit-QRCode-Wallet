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
      <Section
        title={<Text bold align="center">Support</Text>}>
        <Toggle
          settingsKey="debug"
          label="Debug"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(Card);