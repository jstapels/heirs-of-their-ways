/**
 * Aevir Calendar Configuration
 * Registers the custom Aevir calendar with the DnD5e system
 */

Hooks.on('dnd5e.setupCalendar', () => {
  // Verify CONFIG.DND5E.calendar exists
  if (!CONFIG?.DND5E?.calendar?.calendars) {
    console.error("Heirs of Their Ways | DnD5e calendar configuration not found");
    return;
  }

  // Add the Aevir calendar to the DnD5e calendar configuration
  CONFIG.DND5E.calendar.calendars.push({
    value: "aevir",
    label: "Calendar of Aevir",
    config: {
      name: "Calendar of Aevir",
      description: "The calendar used in the world of Aevir, featuring 12 months of 30 days each, with a leap day every 4 years.",
      years: {
        yearZero: 0,
        firstWeekday: 0,
        leapYear: {
          leapStart: 4,
          leapInterval: 4
        }
      },
      months: {
        values: [
          {
            name: "HEIRS.CALENDAR.Aevir.Month.Frostmoot",
            abbreviation: "HEIRS.CALENDAR.Aevir.Month.FrostmootAbbr",
            ordinal: 1,
            days: 30
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Month.Snowstride",
            abbreviation: "HEIRS.CALENDAR.Aevir.Month.SnowstrideAbbr",
            ordinal: 2,
            days: 30
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Month.Thawmarch",
            abbreviation: "HEIRS.CALENDAR.Aevir.Month.ThawmarchAbbr",
            ordinal: 3,
            days: 30
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Month.Bloomtide",
            abbreviation: "HEIRS.CALENDAR.Aevir.Month.BloomtideAbbr",
            ordinal: 4,
            days: 30
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Month.Greenspan",
            abbreviation: "HEIRS.CALENDAR.Aevir.Month.GreenspanAbbr",
            ordinal: 5,
            days: 30
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Month.Sunchase",
            abbreviation: "HEIRS.CALENDAR.Aevir.Month.SunchaseAbbr",
            ordinal: 6,
            days: 30,
            leapDays: 31
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Month.Highsun",
            abbreviation: "HEIRS.CALENDAR.Aevir.Month.HighsunAbbr",
            ordinal: 7,
            days: 30
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Month.Ambercrest",
            abbreviation: "HEIRS.CALENDAR.Aevir.Month.AmbercrestAbbr",
            ordinal: 8,
            days: 30
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Month.Harvestfall",
            abbreviation: "HEIRS.CALENDAR.Aevir.Month.HarvestfallAbbr",
            ordinal: 9,
            days: 30
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Month.Windrise",
            abbreviation: "HEIRS.CALENDAR.Aevir.Month.WindriseAbbr",
            ordinal: 10,
            days: 30
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Month.Duskhollow",
            abbreviation: "HEIRS.CALENDAR.Aevir.Month.DuskhollowAbbr",
            ordinal: 11,
            days: 30
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Month.Nightveil",
            abbreviation: "HEIRS.CALENDAR.Aevir.Month.NightveilAbbr",
            ordinal: 12,
            days: 30
          }
        ]
      },
      days: {
        values: [
          {
            name: "HEIRS.CALENDAR.Aevir.Day.Luminday",
            abbreviation: "HEIRS.CALENDAR.Aevir.Day.LumindayAbbr",
            ordinal: 1
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Day.Terraday",
            abbreviation: "HEIRS.CALENDAR.Aevir.Day.TerradayAbbr",
            ordinal: 2
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Day.Aquaday",
            abbreviation: "HEIRS.CALENDAR.Aevir.Day.AquadayAbbr",
            ordinal: 3
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Day.Emberday",
            abbreviation: "HEIRS.CALENDAR.Aevir.Day.EmberdayAbbr",
            ordinal: 4
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Day.Aerisday",
            abbreviation: "HEIRS.CALENDAR.Aevir.Day.AerisdayAbbr",
            ordinal: 5
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Day.Verdeday",
            abbreviation: "HEIRS.CALENDAR.Aevir.Day.VerdedayAbbr",
            ordinal: 6
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Day.Solarday",
            abbreviation: "HEIRS.CALENDAR.Aevir.Day.SolardayAbbr",
            ordinal: 7
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Day.Lunarday",
            abbreviation: "HEIRS.CALENDAR.Aevir.Day.LunardayAbbr",
            ordinal: 8
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Day.Stellarday",
            abbreviation: "HEIRS.CALENDAR.Aevir.Day.StellardayAbbr",
            ordinal: 9
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Day.Spiritday",
            abbreviation: "HEIRS.CALENDAR.Aevir.Day.SpiritdayAbbr",
            ordinal: 10,
            isRestDay: true
          }
        ],
        daysPerYear: 360,
        hoursPerDay: 24,
        minutesPerHour: 60,
        secondsPerMinute: 60
      },
      festivals: [
        {
          name: "HEIRS.CALENDAR.Aevir.Festival.Midsummer",
          month: 6,
          day: 31
        }
      ],
      seasons: {
        values: [
          {
            name: "HEIRS.CALENDAR.Aevir.Season.Spring",
            dayStart: 61,
            dayEnd: 150
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Season.Summer",
            dayStart: 151,
            dayEnd: 240
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Season.Fall",
            dayStart: 241,
            dayEnd: 330
          },
          {
            name: "HEIRS.CALENDAR.Aevir.Season.Winter",
            dayStart: 331,
            dayEnd: 60
          }
        ]
      }
    }
  });

  console.log("Heirs of Their Ways | Aevir calendar registered");
});
