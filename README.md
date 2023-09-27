# Replugged plugin

[![Install in Replugged](https://img.shields.io/badge/-Install%20in%20Replugged-blue?style=for-the-badge&logo=none)](https://replugged.dev/install?identifier=nosite.dolphinandcat.TimeUtils&source=github)

# dolphinandcat's TimeUtils plugin

`<ct>` replaces it with the current time embedded with discord's <t:> embed
`<ctt>` replaces it with current time and date in plaintext in local timezone
`<ctt:(+/-hour)>` replaces it with current time in plaintext under a different GMT timezone
`<ctc>` replaces it with the current time embedded as a countdown

time format for abs* example: 2000y3o16d5h34m55s is year 2000, month 3, day 16, hour 5, 34 minutes, 55 seconds, values not specified will be replaced by current values
`<abst:(time)>` replaces with time embedded
`<abstt:(time)>` replaces with time plaintext in local timezone
`<abstt:(time):(+/-hour)>` replaces with time plaintext in specified timezone
`<abstc:(time)>` replaces with time embedded as countdown

rt* also has the same format as abs* but is added to current time
`<rt:(time)>` replaces with time embedded
`<rtt:(time)>` replaces with time in plaintext in local timezone
`<rtt:(time):(+/-hour)>` replaces with time plaintext in specified timezone
`<rtc:(time)>` replaces with time embedded as countdown
