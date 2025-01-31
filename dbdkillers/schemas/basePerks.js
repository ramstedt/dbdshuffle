export const basePerks = {
  name: 'basePerks',
  title: 'Base Perks',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'url',
      title: 'URL',
      type: 'string',
      description: 'get the URL from: https://deadbydaylight.fandom.com/wiki/',
      validation: (Rule) => Rule.required(),
    },
  ],
}
