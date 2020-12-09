
export const ActivityType = {
    GLOBAL: "global",
    STRIKES: "strikes",
    CRUCIBLE: "crucible",
    GAMBIT: "gambit",
    SEASONAL: "seasonal",
    PLAYLIST: "playlist",
    EVENT: "event",
    RAID: "raid",
    IRON_BANNER: "iron_banner",
    TRIALS: "trials",
};

export const DestinationType = {
    EDZ: "edz",
    MARS: "mars",
    IO: "io",
    TITAN: "titan",
    MERCURY: "mercury",
    MOON: "moon",
    TANGLED_SHORE: "tangled_shore",
    DREAMING_CITY: "dreaming_city",
    NESSUS: "nessus",
    EUROPA: "europa",
};

export const WeaponType = {
    KINETIC: "kinetic",
    ENERGY: "energy",
    POWER: "power",
    HAND_CANNON: "hand_cannon",
    SUBMACHINE_GUN: "submachine_gun",
    AUTO_RIFLE: "auto_rifle",
    FUSION_RIFLE: "fusion_rifle",
    LINEAR_FUSION_RIFLE: "linear_fusion_rifle",
    SNIPER_RIFLE: "sniper_rifle",
    PULSE_RIFLE: "pulse_rifle",
    SCOUT_RIFLE: "scout_rifle",
    SIDEARM: "sidearm",
    SHOTGUN: "shotgun",
    TRACE_RIFLE: "trace_rifle",
    BOW: "bow",
    NORMAL_GRENADE_LAUNCHER: "normal_grenade_launcher",
    SPECIAL_GRENADE_LAUNCHER: "special_grenade_launcher",
    POWER_GRENADE_LAUNCHER: "power_grenade_launcher",
    MACHINE_GUN: "machine_gun",
    SWORD: "sword",
    ROCKER_LAUNCHER: "rocket_launcher",
};

export const DamageType = {
    SOLAR: "solar",
    ARC: "arc",
    VOID: "void",
    STASIS: "stasis",
    PRECISION: "precision",
};

export const AbilityType = {
    MELEE: "melee",
    GRENADE: "grenade",
    SUPER: "super",
    ABILITIES: "abilities",
    FINISHER: "finisher",
    ORBS: "orbs"
};

export const EnemyType = {
    CABAL: "cabal",
    VEX: "vex",
    FALLEN: "fallen",
    TAKEN: "taken",
    SCORN: "scorn",
    HIVE: "hive",
};

export const Models = {
    ObjectiveMapping(activity, category) {
        return {
            activity: activity,
            category: category,
        }
    },
    Bounty(bountyId, instanceId, name, description, expiration) {
        return {
            bountyId: bountyId,
            instanceId: instanceId,
            name: name,
            description: description,
            expiration: expiration,
        }
    },
    Objective(
        objectiveId, progressDescription, progress, completionValue,
        completed, category, activity, bounty, iconLink
    ) {
        return {
            objectiveId: objectiveId,
            progressDescription: progressDescription,
            progress: progress,
            completionValue: completionValue,
            completed: completed,
            category: category,
            activity: activity,
            bounty: bounty,
            iconLink: iconLink,
        }
    },
};