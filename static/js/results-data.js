// Generated from Video-CADKnitter.pptx — result galleries shown on the project page.
// Each name maps to static/videos/results/<name>.mp4 and static/images/results/<name>.jpg.
window.CADKNITTER_RESULTS = {
  "baselines": {
    "columns": [
      {
        "key": "cond",
        "label": "Condition"
      },
      {
        "key": "gt",
        "label": "Ground truth"
      },
      {
        "key": "matchmaker",
        "label": "MatchMaker"
      },
      {
        "key": "brepgen",
        "label": "BrepGen"
      },
      {
        "key": "ours",
        "label": "CADKnitter (ours)"
      }
    ],
    "rows": [
      {
        "prompt": "Create a thick, smooth circular ring with a hole in the middle, sized so it can easily slide over the long, straight shaft of the given object",
        "cells": {
          "cond": "baselines-01-cond",
          "gt": "baselines-01-gt",
          "matchmaker": "baselines-01-matchmaker",
          "brepgen": "baselines-01-brepgen",
          "ours": "baselines-01-ours"
        },
        "slide": 9
      },
      {
        "prompt": "Make a straight, round stick that can slide through the two matching holes in the ends of the parallel tabs on the given object […]",
        "cells": {
          "cond": "baselines-02-cond",
          "gt": "baselines-02-gt",
          "matchmaker": "baselines-02-matchmaker",
          "brepgen": "baselines-02-brepgen",
          "ours": "baselines-02-ours"
        },
        "slide": 9
      },
      {
        "prompt": "Create a thin, flat plate shaped like a parallelogram that fits exactly inside the open area formed by the three rectangular panels […]",
        "cells": {
          "cond": "baselines-03-cond",
          "gt": "baselines-03-gt",
          "matchmaker": "baselines-03-matchmaker",
          "brepgen": "baselines-03-brepgen",
          "ours": "baselines-03-ours"
        },
        "slide": 10
      },
      {
        "prompt": "Make a piece with a long round stick that has a six-sided short block, the round stick can fit through the hole in the center of the disk […]",
        "cells": {
          "cond": "baselines-04-cond",
          "gt": "baselines-04-gt",
          "matchmaker": "baselines-04-matchmaker",
          "brepgen": "baselines-04-brepgen",
          "ours": "baselines-04-ours"
        },
        "slide": 10
      },
      {
        "prompt": "Make a solid piece shaped like a hexagon, with flat parallel ends and a round hole so it can slide onto the round shaft […]",
        "cells": {
          "cond": "baselines-05-cond",
          "gt": "baselines-05-gt",
          "matchmaker": "baselines-05-matchmaker",
          "brepgen": "baselines-05-brepgen",
          "ours": "baselines-05-ours"
        },
        "slide": 11
      },
      {
        "prompt": "Make a block that is shaped like a rectangle with three holes: put a large hole in the middle, so it can fit the straight stick […]",
        "cells": {
          "cond": "baselines-06-cond",
          "gt": "baselines-06-gt",
          "matchmaker": "baselines-06-matchmaker",
          "brepgen": "baselines-06-brepgen",
          "ours": "baselines-06-ours"
        },
        "slide": 11
      },
      {
        "prompt": "Make a solid, smooth round rod, so that one end of the rod can fit through the large circular hole of the given plate […]",
        "cells": {
          "cond": "baselines-07-cond",
          "gt": "baselines-07-gt",
          "matchmaker": "baselines-07-matchmaker",
          "brepgen": "baselines-07-brepgen",
          "ours": "baselines-07-ours"
        },
        "slide": 12
      },
      {
        "prompt": "Make a thick ring-shaped piece with a smooth round hole through the middle, so that it can fit snugly around the given cylinder […]",
        "cells": {
          "cond": "baselines-08-cond",
          "gt": "baselines-08-gt",
          "matchmaker": "baselines-08-matchmaker",
          "brepgen": "baselines-08-brepgen",
          "ours": "baselines-08-ours"
        },
        "slide": 12
      }
    ]
  },
  "ablation": {
    "columns": [
      {
        "key": "cond",
        "label": "Condition"
      },
      {
        "key": "gt",
        "label": "Ground truth"
      },
      {
        "key": "noguide",
        "label": "w/o guidance"
      },
      {
        "key": "nodsem",
        "label": "w/o D<sub>sem</sub>"
      },
      {
        "key": "ours",
        "label": "Full model"
      }
    ],
    "rows": [
      {
        "prompt": "Create a thick, smooth circular ring with a hole in the middle, sized so it can easily slide over the long, straight shaft of the given object",
        "cells": {
          "cond": "baselines-01-cond",
          "gt": "baselines-01-gt",
          "noguide": "ablation-01-noguide",
          "nodsem": "ablation-01-nodsem",
          "ours": "baselines-01-ours"
        },
        "slide": 14
      },
      {
        "prompt": "Create a thin, flat plate shaped like a parallelogram that fits exactly inside the open area formed by the three rectangular panels […]",
        "cells": {
          "cond": "baselines-03-cond",
          "gt": "baselines-03-gt",
          "noguide": "ablation-02-noguide",
          "nodsem": "ablation-02-nodsem",
          "ours": "baselines-03-ours"
        },
        "slide": 14
      },
      {
        "prompt": "Create a tall stick with the same width as the given block, so that one end of the stick can slide straight into side of given object […]",
        "cells": {
          "cond": "ablation-03-cond",
          "gt": "ablation-03-gt",
          "noguide": "ablation-03-noguide",
          "nodsem": "ablation-03-nodsem",
          "ours": "ablation-03-ours"
        },
        "slide": 15
      },
      {
        "prompt": "Create a cylinder with a flat circular face on one end that fits exactly into the round hole on the rectangular block […]",
        "cells": {
          "cond": "ablation-04-cond",
          "gt": "ablation-04-gt",
          "noguide": "ablation-04-noguide",
          "nodsem": "ablation-04-nodsem",
          "ours": "ablation-04-ours"
        },
        "slide": 15
      },
      {
        "prompt": "Create a rectangular block with a round rod sticking straight out from the middle of one side, so the block rests against the base […]",
        "cells": {
          "cond": "ablation-05-cond",
          "gt": "ablation-05-gt",
          "noguide": "ablation-05-noguide",
          "nodsem": "ablation-05-nodsem",
          "ours": "ablation-05-ours"
        },
        "slide": 16
      },
      {
        "prompt": "Design a tall, narrow prism with flat sides, sized so that one of its flat rectangular faces rest flush along that slanted edge […]",
        "cells": {
          "cond": "ablation-06-cond",
          "gt": "ablation-06-gt",
          "noguide": "ablation-06-noguide",
          "nodsem": "ablation-06-nodsem",
          "ours": "ablation-06-ours"
        },
        "slide": 16
      }
    ]
  },
  "unseen": {
    "columns": [
      {
        "key": "cond",
        "label": "Condition"
      },
      {
        "key": "gt",
        "label": "Ground truth"
      },
      {
        "key": "noguide",
        "label": "w/o guidance"
      },
      {
        "key": "ours",
        "label": "CADKnitter (ours)"
      }
    ],
    "rows": [
      {
        "prompt": "Create a solid, flat circular ring, so that it can sit in place around the grooves on the side of the given short cylinder […]",
        "cells": {
          "cond": "unseen-01-cond",
          "gt": "unseen-01-gt",
          "noguide": "unseen-01-noguide",
          "ours": "unseen-01-ours"
        },
        "slide": 18
      },
      {
        "prompt": "Make a flat, solid rectangle that is just thick enough to stay sturdy; sized so its rounded corners match into the given object's flat end […]",
        "cells": {
          "cond": "unseen-02-cond",
          "gt": "unseen-02-gt",
          "noguide": "unseen-02-noguide",
          "ours": "unseen-02-ours"
        },
        "slide": 18
      },
      {
        "prompt": "Make a hollow tube with both ends open, so that the tube can slide over the smaller end of the given object […]",
        "cells": {
          "cond": "unseen-03-cond",
          "gt": "unseen-03-gt",
          "noguide": "unseen-03-noguide",
          "ours": "unseen-03-ours"
        },
        "slide": 19
      },
      {
        "prompt": "Make a solid round piece with a hole through its center, so the hole is just wide enough to slide over the given stick-shaped object […]",
        "cells": {
          "cond": "unseen-04-cond",
          "gt": "unseen-04-gt",
          "noguide": "unseen-04-noguide",
          "ours": "unseen-04-ours"
        },
        "slide": 19
      },
      {
        "prompt": "Create a straight, round stick with a flat disk at each end, making sure the stick can slide through the hole on the given object […]",
        "cells": {
          "cond": "unseen-05-cond",
          "gt": "unseen-05-gt",
          "noguide": "unseen-05-noguide",
          "ours": "unseen-05-ours"
        },
        "slide": 20
      },
      {
        "prompt": "Make a straight, smooth cylinder shaped like a rod, so that one end can fit snugly through the round hole of the given piece […]",
        "cells": {
          "cond": "unseen-06-cond",
          "gt": "unseen-06-gt",
          "noguide": "unseen-06-noguide",
          "ours": "unseen-06-ours"
        },
        "slide": 20
      },
      {
        "prompt": "Make a straight, smooth cylinder with flat ends that is sized to fit snugly into the round hole in the middle of the given object […]",
        "cells": {
          "cond": "unseen-07-cond",
          "gt": "unseen-07-gt",
          "noguide": "unseen-07-noguide",
          "ours": "unseen-07-ours"
        },
        "slide": 21
      },
      {
        "prompt": "Make a straight, round stick, so that it can slide through the two holes of the given object, fitting securely from one side to the other […]",
        "cells": {
          "cond": "unseen-08-cond",
          "gt": "unseen-08-gt",
          "noguide": "unseen-08-noguide",
          "ours": "unseen-08-ours"
        },
        "slide": 21
      },
      {
        "prompt": "Make a round stick with flat ends that is sized to slide all the way through the larger hole in the given flat round piece […]",
        "cells": {
          "cond": "unseen-09-cond",
          "gt": "unseen-09-gt",
          "noguide": "unseen-09-noguide",
          "ours": "unseen-09-ours"
        },
        "slide": 22
      },
      {
        "prompt": "Make a round piece with a small straight hole running all the way through its center, so that the given cylinder can slide snugly into […]",
        "cells": {
          "cond": "unseen-10-cond",
          "gt": "unseen-10-gt",
          "noguide": "unseen-10-noguide",
          "ours": "unseen-10-ours"
        },
        "slide": 22
      },
      {
        "prompt": "Make a piece shaped like a solid round disc, so that the disc fits snugly into the long slot of the given object […]",
        "cells": {
          "cond": "unseen-11-cond",
          "gt": "unseen-11-gt",
          "noguide": "unseen-11-noguide",
          "ours": "unseen-11-ours"
        },
        "slide": 23
      },
      {
        "prompt": "Make a thick, solid ring with a round shape, so the it can flex open slightly and press into the inner stepped ledge of the given object […]",
        "cells": {
          "cond": "unseen-12-cond",
          "gt": "unseen-12-gt",
          "noguide": "unseen-12-noguide",
          "ours": "unseen-12-ours"
        },
        "slide": 23
      }
    ]
  },
  "assembly": {
    "columns": [
      {
        "key": "cond",
        "label": "Condition"
      },
      {
        "key": "gt",
        "label": "Ground-truth assembly"
      },
      {
        "key": "gen",
        "label": "Generated part"
      },
      {
        "key": "combined",
        "label": "Generated + condition"
      }
    ],
    "rows": [
      {
        "prompt": "Make a block and add a hole at the middle of the rounded end so the given cylinder can slide through the hole and be held snugly […]",
        "cells": {
          "cond": "assembly-01-cond",
          "gt": "assembly-01-gt",
          "gen": "assembly-01-gen",
          "combined": "assembly-01-combined"
        },
        "slide": 25
      },
      {
        "prompt": "Make a straight, smooth round rod that will fit snugly through the middle hole of the given disk […]",
        "cells": {
          "cond": "assembly-02-cond",
          "gt": "assembly-02-gt",
          "gen": "assembly-02-gen",
          "combined": "assembly-02-combined"
        },
        "slide": 25
      },
      {
        "prompt": "Make a hollow tube with a wide rim at one end, so that the rim sits flat against the plate and the tube fits through the big central hole […]",
        "cells": {
          "cond": "assembly-03-cond",
          "gt": "assembly-03-gt",
          "gen": "assembly-03-gen",
          "combined": "assembly-03-combined"
        },
        "slide": 26
      },
      {
        "prompt": "Make a short, thick tube that is open at both ends, so the tube can slide over the middle part of the given stepped cylinder […]",
        "cells": {
          "cond": "assembly-04-cond",
          "gt": "assembly-04-gt",
          "gen": "assembly-04-gen",
          "combined": "assembly-04-combined"
        },
        "slide": 26
      },
      {
        "prompt": "Make a long, straight round stick with a flat disk, so that the stick can slide smoothly through the hole in the block-shaped object […]",
        "cells": {
          "cond": "assembly-05-cond",
          "gt": "assembly-05-gt",
          "gen": "assembly-05-gen",
          "combined": "assembly-05-combined"
        },
        "slide": 27
      },
      {
        "prompt": "Make a smooth round rod with a flat, slightly wider circular plate at each end, so that the middle rod can slide neatly through the hole […]",
        "cells": {
          "cond": "assembly-06-cond",
          "gt": "assembly-06-gt",
          "gen": "assembly-06-gen",
          "combined": "assembly-06-combined"
        },
        "slide": 27
      }
    ]
  },
  "dataset": [
    {
      "prompt": "Make a straight, round stick that can slide through the two holes in the ends of the parallel tabs on the given object […]",
      "video": "baselines-02-gt"
    },
    {
      "prompt": "Make a flat, triangle-shaped piece with a hole, so that this hole can fit around the outer narrow cylinder […]",
      "video": "dataset-02"
    },
    {
      "prompt": "Create a curved piece shaped like a thick half-cylinder with two flat tabs fitting over the two flat flanges of the given object […]",
      "video": "dataset-03"
    },
    {
      "prompt": "Create a hollow tube shaped like a cylinder, sized so that one end can slide inside one of the cylindrical openings of the given object […]",
      "video": "dataset-04"
    },
    {
      "prompt": "Create a solid cylinder with a wide middle section and narrower cylindrical ends that fit inside the hole on the given object […]",
      "video": "dataset-05"
    },
    {
      "prompt": "Create a solid stick shaped like a round cylinder so it can slide straight down into that hole and fit tightly inside it […]",
      "video": "dataset-06"
    },
    {
      "prompt": "Make a solid, smooth round rod, so that one end of the rod can fit through the large circular hole of the given plate […]",
      "video": "baselines-07-gt"
    },
    {
      "prompt": "Create a long rectangular bar with sharp edges that fits exactly into the recessed square of the given object […]",
      "video": "dataset-08"
    },
    {
      "prompt": "Create a short, wide cylinder with flat circular faces, sized so that it fits into the smaller central hole of the given three-lobed piece […]",
      "video": "dataset-09"
    },
    {
      "prompt": "Design a block shaped with a smaller rectangular piece forming an L shape, so that the given object can fit snugly into […]",
      "video": "dataset-10"
    },
    {
      "prompt": "Make a thick, short ring with a hole in the center so it can slide lengthwise onto the shaft of the given object […]",
      "video": "dataset-11"
    },
    {
      "prompt": "Make a round disk with a short, smooth round stick, so that the stick can fit snugly into one of the holes near the end of the piece […]",
      "video": "dataset-12"
    },
    {
      "prompt": "Create a block with three evenly spaced cutouts, so that each cutout can fit onto the matching rectangular protrusions […]",
      "video": "dataset-13"
    },
    {
      "prompt": "Make a piece with a long round stick that has a six-sided short block, the round stick can fit through the hole of the disk […]",
      "video": "baselines-04-gt"
    }
  ]
};
