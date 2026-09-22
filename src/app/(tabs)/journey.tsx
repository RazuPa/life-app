import { useState } from "react";

import { Alert, Modal, Pressable, StyleSheet, View } from "react-native";

import AppButton from "../../components/AppButton";
import AppCard from "../../components/AppCard";
import AppScreen from "../../components/AppScreen";
import AppText from "../../components/AppText";
import SectionHeader from "../../components/SectionHeader";

import { Activity, useApp } from "../../context/AppContext";

import { useTheme } from "../../context/ThemeContext";

export default function JourneyScreen() {
  const { activities, totalXP, deleteActivity } = useApp();

  const { theme } = useTheme();

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

  function formatTime(date: Date) {
    return new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  function handleDelete(activity: Activity) {
    Alert.alert(
      "Delete activity?",
      "This activity and its XP will be removed from your journey.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteActivity(activity.id);
            setSelectedActivity(null);
          },
        },
      ],
    );
  }

  return (
    <>
      <AppScreen>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <AppText variant="pageTitle">Journey</AppText>

            <AppText variant="secondary">Your real-life progress</AppText>
          </View>

          <AppCard variant="alt" padding={0} style={styles.headerIcon}>
            <AppText style={styles.headerEmoji}>📖</AppText>
          </AppCard>
        </View>

        <AppCard style={styles.lifetimeCard}>
          <View style={styles.lifetimeContent}>
            <AppText variant="label">LIFETIME XP</AppText>

            <AppText variant="xp" style={styles.lifetimeXP}>
              {totalXP}
            </AppText>

            <AppText variant="secondary">
              XP earned across your entire journey
            </AppText>
          </View>

          <AppText style={styles.lifetimeEmoji}>✨</AppText>
        </AppCard>

        <SectionHeader
          title="Activity history"
          actionLabel={`${activities.length} ${
            activities.length === 1 ? "activity" : "activities"
          }`}
        />

        {activities.length === 0 ? (
          <AppCard style={styles.emptyCard}>
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor: theme.colors.cardAlt,
                },
              ]}
            >
              <AppText style={styles.emptyEmoji}>🗺️</AppText>
            </View>

            <AppText variant="title">Your journey starts here</AppText>

            <AppText variant="secondary" style={styles.emptyText}>
              Activities you complete will become part of your permanent
              history.
            </AppText>
          </AppCard>
        ) : (
          <View style={styles.activityList}>
            {activities.map((activity) => (
              <AppCard
                key={activity.id}
                onPress={() => setSelectedActivity(activity)}
                style={styles.activityCard}
              >
                <View
                  style={[
                    styles.activityIconContainer,
                    {
                      backgroundColor: theme.colors.cardAlt,
                    },
                  ]}
                >
                  <AppText style={styles.activityIcon}>{activity.icon}</AppText>
                </View>

                <View style={styles.activityContent}>
                  <AppText variant="title" style={styles.activityTitle}>
                    {activity.title}
                  </AppText>

                  <AppText variant="secondary">{activity.details}</AppText>

                  <AppText variant="caption" style={styles.activityDate}>
                    {formatDate(activity.createdAt)}
                    {" • "}
                    {formatTime(activity.createdAt)}
                  </AppText>

                  {activity.note !== "" && (
                    <AppText
                      variant="caption"
                      numberOfLines={1}
                      style={styles.activityNote}
                    >
                      {activity.note}
                    </AppText>
                  )}
                </View>

                <View style={styles.xpContainer}>
                  <AppText variant="xp">+{activity.xp}</AppText>

                  <AppText variant="caption">XP</AppText>
                </View>
              </AppCard>
            ))}
          </View>
        )}
      </AppScreen>

      <Modal
        visible={selectedActivity !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedActivity(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelectedActivity(null)}
        >
          <Pressable
            style={[
              styles.modalCard,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => {}}
          >
            {selectedActivity && (
              <>
                <View style={styles.modalHeader}>
                  <View
                    style={[
                      styles.modalIcon,
                      {
                        backgroundColor: theme.colors.cardAlt,
                      },
                    ]}
                  >
                    <AppText style={styles.modalEmoji}>
                      {selectedActivity.icon}
                    </AppText>
                  </View>

                  <Pressable
                    style={[
                      styles.closeButton,
                      {
                        backgroundColor: theme.colors.cardAlt,
                      },
                    ]}
                    onPress={() => setSelectedActivity(null)}
                  >
                    <AppText style={styles.closeText}>×</AppText>
                  </Pressable>
                </View>

                <AppText variant="pageTitle" style={styles.modalTitle}>
                  {selectedActivity.title}
                </AppText>

                <AppText variant="secondary">
                  {selectedActivity.details}
                </AppText>

                <AppCard variant="alt" style={styles.xpCard}>
                  <AppText variant="label">XP EARNED</AppText>

                  <AppText variant="xp" style={styles.xpCardValue}>
                    +{selectedActivity.xp} XP
                  </AppText>
                </AppCard>

                <View
                  style={[
                    styles.detailRow,
                    {
                      borderBottomColor: theme.colors.border,
                    },
                  ]}
                >
                  <AppText variant="secondary">Date</AppText>

                  <AppText style={styles.detailValue}>
                    {formatDate(selectedActivity.createdAt)}
                  </AppText>
                </View>

                <View
                  style={[
                    styles.detailRow,
                    {
                      borderBottomColor: theme.colors.border,
                    },
                  ]}
                >
                  <AppText variant="secondary">Time</AppText>

                  <AppText style={styles.detailValue}>
                    {formatTime(selectedActivity.createdAt)}
                  </AppText>
                </View>

                {selectedActivity.note !== "" && (
                  <View style={styles.noteSection}>
                    <AppText variant="secondary">Note</AppText>

                    <AppText style={styles.noteText}>
                      {selectedActivity.note}
                    </AppText>
                  </View>
                )}

                <AppButton
                  title="Delete activity"
                  variant="danger"
                  onPress={() => handleDelete(selectedActivity)}
                  style={styles.deleteButton}
                />
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 28,
  },

  headerText: {
    flex: 1,
  },

  headerIcon: {
    width: 48,
    height: 48,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",
  },

  headerEmoji: {
    fontSize: 24,
  },

  lifetimeCard: {
    flexDirection: "row",
    alignItems: "center",

    padding: 20,

    marginBottom: 30,
  },

  lifetimeContent: {
    flex: 1,
  },

  lifetimeXP: {
    fontSize: 34,

    marginTop: 3,
    marginBottom: 4,
  },

  lifetimeEmoji: {
    fontSize: 38,

    marginLeft: 15,
  },

  emptyCard: {
    alignItems: "center",

    padding: 28,
  },

  emptyIcon: {
    width: 68,
    height: 68,

    borderRadius: 22,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 15,
  },

  emptyEmoji: {
    fontSize: 31,
  },

  emptyText: {
    textAlign: "center",

    marginTop: 7,
  },

  activityList: {
    gap: 12,
  },

  activityCard: {
    flexDirection: "row",
    alignItems: "center",

    padding: 14,
  },

  activityIconContainer: {
    width: 50,
    height: 50,

    borderRadius: 15,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 13,
  },

  activityIcon: {
    fontSize: 24,
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 15,

    marginBottom: 2,
  },

  activityDate: {
    marginTop: 5,
  },

  activityNote: {
    marginTop: 4,
  },

  xpContainer: {
    alignItems: "flex-end",

    marginLeft: 8,
  },

  modalOverlay: {
    flex: 1,

    backgroundColor: "rgba(0, 0, 0, 0.65)",

    justifyContent: "center",

    paddingHorizontal: 22,
  },

  modalCard: {
    borderRadius: 26,
    borderWidth: 1,

    padding: 22,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 18,
  },

  modalIcon: {
    width: 58,
    height: 58,

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",
  },

  modalEmoji: {
    fontSize: 29,
  },

  closeButton: {
    width: 38,
    height: 38,

    borderRadius: 19,

    justifyContent: "center",
    alignItems: "center",
  },

  closeText: {
    fontSize: 27,
    lineHeight: 29,
  },

  modalTitle: {
    fontSize: 25,

    marginBottom: 5,
  },

  xpCard: {
    marginTop: 20,
    marginBottom: 8,
  },

  xpCardValue: {
    fontSize: 23,

    marginTop: 3,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingVertical: 15,

    borderBottomWidth: 1,
  },

  detailValue: {
    fontSize: 13,
    fontWeight: "700",
  },

  noteSection: {
    paddingTop: 15,
  },

  noteText: {
    marginTop: 7,
  },

  deleteButton: {
    marginTop: 24,
  },
});
